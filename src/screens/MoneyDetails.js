import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import CustomTextInput from '../components/CustomTextInput';
import { StatusBar } from 'expo-status-bar';
import { Color } from '../../GlobalStyles';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ScrollView } from 'react-native-gesture-handler';
import CustomeIconButton from '../components/CustomeIconButton';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
// import { useIsConnected } from 'react-native-offline';
import { ref as dbRef, set } from 'firebase/database';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore/lite';
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, firestoreDB } from '../config/firebase';
import * as Location from 'expo-location';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';
import CustomTextArea from '../components/CustomTextArea';
import { useRoute } from '@react-navigation/native';
import { generateAutoNumber } from '../utils/functions';
const MoneyDetails = () => {
     const { activeUser, setActiveUser } = useContext(AuthContext);
     const navigation = useNavigation();
     const route = useRoute();
     const { data } = route.params;
     const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
     const [isButtonPressed, setIsButtonPressed] = useState(false);
     const [isImageSelected, setIsImageSelected] = useState(false);
     const [confirmShowPassword, setConfirmShowPassword] = useState(false);
     const [showPassword, setShowPassword] = useState(false);
     const [location, setLocation] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     const initialState = {
          title: '',
          desc: '',
     }
     const [state, setState] = useState(initialState);
     const [error, setError] = useState({
          title: '',
          desc: '',
     });
     const storage = getStorage();
     const metadata = {
          contentType: 'image/jpeg'
     };

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
          } else if (!state.title) {
               errors.title = true;
               handleToast('error', 'Title', 'Please Enter Title of Donation')
          } else if (!state.desc) {
               errors.desc = true;
               handleToast('error', 'Description', 'Please Enter Description of Donation')
          } else if (!location) {
               handleToast('error', 'Location', 'Location is required')
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
                    // aspect: [4, 3],
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
          setIsLoading(true)
          console.log("previous data", data, state, location);
          // convert image into blob image 
          const response = await fetch(isImageSelected)
          const blob = await response.blob()
          // register users in firebase authentication
          const user = activeUser.uid;
          const userData = activeUser;
          const dontaionId = generateAutoNumber(15);

          // upload image on firebase storage 

          const storageRef = ref(storage, 'User Money Donation Invoices/' + Date.now());
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
                         // store user data into firebase firestore database
                         setDoc(doc(firestoreDB, "Donations", dontaionId), { donorImage: activeUser?.photoURL, image: downloadURL, ...state, userlocation: location, dateCreated: serverTimestamp(), uid: user, type: 'charity', amount: data, status: 'PENDING', donationId: dontaionId })

                              // store user email and uid in firebase realtime databases
                              // set(dbRef(db, 'users/' + user), {
                              //   user,
                              //   // status: isConnected,
                              //   location: location,
                              // })
                              .then(() => {
                                   handleToast("success", "Donation Creation", "Donation Created Successfully")
                                   setIsLoading(false)
                                   setActiveUser(userData)
                                   setState(initialState)
                                   navigation.navigate('Categories')
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

     };
     return (
          <SafeAreaView style={styles.container}>
               <StatusBar backgroundColor='transparent' translucent={false} style='dark' />

               <View style={styles.subContainer}>
                    <View style={styles.headerContainer}>
                         <TouchableOpacity onPress={() => navigation.goBack()}>
                              <Ionicons name="arrow-back" size={26} color={Color.textPrimary} />
                         </TouchableOpacity>
                         <Text style={styles.heading}>Donation Details</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                         <View style={styles.header}>
                              {/* <Text style={styles.heading}>Let’s Get Started</Text> */}
                              {/* <Text style={styles.subHeading}>Create an account to get all features</Text> */}
                              <View style={styles.content}>
                                   <View style={styles.imageContainer}>
                                        <TouchableOpacity activeOpacity={0.5} style={{ width: '100%', height: '100%' }} onPress={handlePickImage} >
                                             {isImageSelected ?
                                                  <View style={[styles.activeImageContainer, { elevation: 2, borderRadius: 20 }]}>
                                                       <Image style={styles.image} source={{ uri: isImageSelected }} resizeMode='contain' />
                                                  </View>
                                                  :
                                                  <View style={styles.inactiveImageContainer}>
                                                       <Feather name="image" size={54} color={Color.primary} />
                                                       <Text style={{ fontSize: 20, lineHeight: 30, color: Color.textPrimary, letterSpacing: 1, textAlign: 'center' }}>Upload Donation Payment Invoice</Text>
                                                       {/* <FontAwesome name="user-circle-o" size={154}  /> */}
                                                  </View>
                                             }
                                        </TouchableOpacity>
                                   </View>
                                   <View style={styles.inputContainer}>
                                        <CustomTextInput
                                             label="Title"
                                             placeholder="Enter Donation Title"
                                             value={state.title}
                                             onChangeText={text => handleInputChange('title', text)}
                                             error={!!error.title && true}
                                        />

                                        <CustomTextArea
                                             label="Description"
                                             placeholder="Enter Description"
                                             value={state.desc}
                                             onChangeText={text => handleInputChange('desc', text)}
                                             error={!!error.desc && true}
                                             multiline
                                             numberOfLines={7}
                                        />
                                   </View>

                                   <View style={styles.btnContainer}>
                                        <TouchableOpacity onPress={handleSubmit}>
                                             <CustomeIconButton
                                                  title="Donate Now"
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
     headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
     },
     heading: {
          fontSize: 25,
          color: Color.textPrimary,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontWeight: '600',
          letterSpacing: 1
     },
     subContainer: {
          // marginTop: '10%',
          borderWidth: 2,
          borderColor: 'white',
          height: '100%',
          paddingHorizontal: '7%',
          width: '100%',
     },
     subHeading: {
          color: Color.heading2,
          fontSize: 20,
          width: '100%'
     },
     imageContainer: {
          height: 220,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
     },
     inactiveImageContainer: {
          borderWidth: 2,
          borderColor: Color.primary,
          backgroundColor: Color.secondary,
          borderRadius: 20,
          borderStyle: 'dashed',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          paddingHorizontal: '20%'

     },
     activeImageContainer: {
          height: '100%',
     },
     image: {
          width: '100%',
          height: '100%',
          objectFit: "fill",
          borderRadius: 18,
          justifyContent: 'center',
          alignItems: 'center',
     },
     content: {
          width: '100%',
          alignItems: 'center',
          height: '100%',
          paddingVertical: '20%',
          gap: 40
     },
     inputContainer: {
          width: '100%',
          // marginTop: '5%',
          marginBottom: '5%',
          gap: 15,
     },
     btnContainer: {
          width: '100%',
          marginBottom: 10,
     },
     btn: {
          backgroundColor: Color.primary,
          borderWidth: 1,
          borderColor: Color.primary,
          // marginTop: '5%'
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

export default MoneyDetails;
