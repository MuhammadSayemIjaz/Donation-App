import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import CustomTextInput from '../../components/CustomTextInput';
import { StatusBar } from 'expo-status-bar';
import { Color } from '../../../GlobalStyles';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ScrollView } from 'react-native-gesture-handler';
import CustomeIconButton from '../../components/CustomeIconButton';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
// import { useIsConnected } from 'react-native-offline';
import { ref as dbRef, set } from 'firebase/database';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore/lite';
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, firestoreDB } from '../../config/firebase';
import * as Location from 'expo-location';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserSignup = () => {
  const { activeUser, setActiveUser } = useContext(AuthContext);
  const navigation = useNavigation();
  // const isConnected = useIsConnected();
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const initialState = {
    name: '',
    email: '',
    mobileNo: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: 'receiver'

  }
  const [state, setState] = useState(initialState);
  const [error, setError] = useState({
    hospitalName: '',
    email: '',
    mobileNo: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const storage = getStorage();
  const metadata = {
    contentType: 'image/jpeg'
  };
  const mobileRegex = /^(\+92|0)[0-9]{3}-[0-9]{7}$/;

  const handleToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      topOffset: 50,
    });
  }

  const validateForm = () => {
    let errors = {};
    if (!isImageSelected) {
      handleToast('error', 'Profile Image', 'Image Is required')
      return;
    } else if (!state.name) {
      errors.name = true;
      handleToast('error', 'User Name', 'User Name is required')
    } else if (!state.email) {
      error.email = true;
      handleToast('error', 'User Email', 'User Email is required')
    } else if (!state.mobileNo) {
      errors.mobileNo = true;
      handleToast('error', 'Mobile Number', 'Mobile Number is required')
    } else if (state.mobileNo.length < 12 && state.mobileNo.length > 12) {
      errors.mobileNo = true;
      handleToast('error', 'Mobile Number', 'Mobile Number must be  11 digits')
    } else if (!mobileRegex.test(state.mobileNo)) {
      errors.mobileNo = true;
      handleToast('error', 'Mobile Number', 'Invalid mobile number')
    } else if (!state.address) {
      errors.address = true;
      handleToast('error', 'Address', 'Address is required')
    } else if (!state.password) {
      errors.password = true;
      handleToast('error', 'Password', 'Password is required')
    } else if (state.password.length < 6) {
      errors.password = true;
      handleToast('error', 'Password', 'Password must be at least 6 characters long')
    } else if (!state.confirmPassword) {
      errors.confirmPassword = true;
      handleToast('error', 'Confirm password', 'Confirm password is required')
    } else if (state.password !== state.confirmPassword) {
      errors.confirmPassword = true;
      handleToast('error', 'Confirm password', 'Passwords do not match')
    }
    setError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleRadioChange = (newValue) => {
    setState({ ...state, role: newValue });
  };
  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
      getLocation();
    })();
  }, [isButtonPressed]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const { longitude, latitude } = location.coords;
    setLocation({
      longitude: longitude,
      latitude: latitude,
    })
  }

  const handlePickImage = async () => {
    setIsButtonPressed(true)
    if (hasGalleryPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [4, 3],
      });
      if (!result.canceled) {
        setIsImageSelected(result.assets[0].uri);
      } else {
        handleToast("error", "Image Selection", "Please Select Image")
      }
    }
    else if (hasGalleryPermission) {
      handleToast('error', 'Access Denied', 'Sorry, we need camera roll permissions to make this work!')
      setIsButtonPressed(true)
    }
  };

  const handleSubmit = async () => {

    // console.log(state, location);

    setIsLoading(true)
    const { email, password } = state;

    // convert image into blob image 
    const response = await fetch(isImageSelected)
    const blob = await response.blob()
    // register users in firebase authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // store userid in user variable
        const user = userCredential.user.uid;
        const userData = userCredential.user;

        // upload image on firebase storage 

        const storageRef = ref(storage, 'User Images/' + Date.now());
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            handleToast("info", "Image Upload", `Upload is ${progress.toFixed(0)} % done`);
          },
          (error) => {
            handleToast("error", "Upload Image Error", error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // update profile in authentication
              updateProfile(auth.currentUser, {
                displayName: state.name, photoURL: downloadURL
              })
              // store user data into firebase firestore database
              setDoc(doc(firestoreDB, "users", user), { profileImageUrl: downloadURL, ...state, userlocation: location,  dateCreated: serverTimestamp(), uid: user })

              // store user email and uid in firebase realtime databases
              // set(dbRef(db, 'users/' + user), {
              //   user,
              //   // status: isConnected,
              //   location: location,
              // })
                .then(() => {
                  handleToast("success", "Register User", "User Created Successfully")
                  setIsLoading(false)
                  setActiveUser(userData)
                  setState(initialState)
                  navigation.navigate('Login')
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  handleToast("error", errorCode, errorMessage)
                  setIsLoading(false)
                })
            });
          },
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        handleToast("error", errorCode, errorMessage)
        setIsLoading(false)
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='transparent' translucent={true} style='light' />
      <View style={styles.subContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.heading}>Let’s Get Started</Text>
            <Text style={styles.subHeading}>Create an account to get all features</Text>
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <TouchableOpacity activeOpacity={0.5} style={{ width: '100%' }} onPress={handlePickImage} >
                  {isImageSelected ?
                    <View style={[styles.image, { elevation: 5 }]}>
                      <Image style={styles.image} source={{ uri: isImageSelected }} resizeMode='contain' />
                    </View>
                    :
                    <View style={styles.image}>
                      <FontAwesome name="user-circle-o" size={154} color={Color.primary} />
                    </View>
                  }
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <CustomTextInput
                  label="User Name"
                  placeholder="Enter Your Name"
                  left={
                    <TextInput.Icon iconColor={Color.primary} icon="account" size={30} />
                  }
                  value={state.name}
                  onChangeText={text => handleInputChange('name', text)}
                  error={!!error.name && true}
                />
                <CustomTextInput
                  label="User Email"
                  placeholder="Enter your Email"
                  left={
                    <TextInput.Icon iconColor={Color.primary} icon="email" size={30} />
                  }
                  value={state.email}
                  onChangeText={text => handleInputChange('email', text.toLowerCase())}
                  error={!!error.email && true}
                />
                <CustomTextInput
                  label="Mobile No"
                  placeholder="0300-1070900"
                  keyboardType="phone-pad"
                  maxLength={12}
                  left={
                    <TextInput.Icon iconColor={Color.primary} icon="cellphone" size={30} />
                  }
                  value={state.mobileNo}
                  onChangeText={text => handleInputChange('mobileNo', text)}
                  error={!!error.mobileNo && true}
                />

                <CustomTextInput
                  label="Address"
                  placeholder="Enter Address"
                  left={
                    <TextInput.Icon iconColor={Color.primary} icon={"home"} size={30} />
                  }
                  value={state.address}
                  onChangeText={text => handleInputChange('address', text)}
                  error={!!error.address && true}
                />
                <CustomTextInput
                  label="Password"
                  placeholder="Enter Password"
                  left={
                    <TextInput.Icon iconColor={Color.primary} icon="lock" size={30} />
                  }
                  right={
                    <TextInput.Icon onPress={() => setShowPassword(!showPassword)} iconColor={Color.primary} icon={showPassword ? "eye" : 'eye-off'} size={30} />
                  }
                  secureTextEntry={showPassword ? false : true}
                  value={state.password}
                  onChangeText={text => handleInputChange('password', text)}
                  error={!!error.password && true}
                />
                <CustomTextInput
                  label="Confirm Password"
                  placeholder="Enter Password"
                  left={
                    <TextInput.Icon iconColor={Color.primary} icon="lock" size={30} />
                  }
                  right={
                    <TextInput.Icon onPress={() => setConfirmShowPassword(!confirmShowPassword)} iconColor={Color.primary} icon={confirmShowPassword ? "eye" : 'eye-off'} size={30} />
                  }
                  secureTextEntry={confirmShowPassword ? false : true}
                  value={state.confirmPassword}
                  onChangeText={text => handleInputChange('confirmPassword', text)}
                  error={!!error.confirmPassword && true}
                />
              </View>

              <Text style={styles.subHeading}>Choose Your Role:</Text>
              <RadioButton.Group value={state.role} onValueChange={handleRadioChange}>
                <View style={styles.radioBtnContainer}>
                  <View style={styles.radioItem}>
                    {/* <Text style={styles.radioLable}>Donor</Text> */}
                    <RadioButton.Item color={Color.primary} label='Donor' labelStyle={styles.radioLable} value="donor" />
                  </View>
                  <View style={styles.radioItem}>
                    {/* <Text style={styles.radioLable}>Receiver</Text> */}
                    <RadioButton.Item color={Color.primary} label='Receiver' labelStyle={styles.radioLable} value="receiver" />
                  </View>
                </View>
              </RadioButton.Group>
              <View style={styles.btnContainer}>
                <TouchableOpacity onPress={handleSubmit}>
                  <CustomeIconButton
                    title="Sign Up"
                    isLoading={isLoading}
                    titleStyle={{ color: Color.textSecondary }}
                    style={styles.btn}
                    onPress={() => {
                      if (validateForm()) {
                        handleSubmit();
                      }
                    }}
                  />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputConatiner: {
    padding: '5%'
  },
  subContainer: {
    marginTop: '10%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    height: '100%',
    backgroundColor: Color.containerColor
  },
  header: {
    padding: '7%'
  },
  heading: {
    color: Color.heading1,
    fontSize: 25,
  },
  subHeading: {
    color: Color.heading2,
    fontSize: 20,
    width: '100%'
  },
  imageContainer: {
    marginTop: '5%',
    height: 190,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 190,
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 60,
  },
  inputContainer: {
    width: '100%',
    // marginTop: '5%',
    marginBottom: '5%',
    gap: 5,
  },
  btnContainer: {
    width: '100%',
    marginBottom: 10,
  },
  btn: {
    backgroundColor: Color.primary,
    borderWidth: 1,
    borderColor: Color.primary,
    marginTop: '5%'
  },
  radioBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '5%',
  },
  radioItem: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  radioLable: {
    fontSize: 20,
  }
});

export default UserSignup;
