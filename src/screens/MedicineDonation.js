import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput, HelperText, Button, Title, IconButton } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import CustomTextInput from '../components/CustomTextInput';
import Toast from 'react-native-toast-message';
import CustomeIconButton from '../components/CustomeIconButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Color } from '../../GlobalStyles';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore/lite';
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firestoreDB } from '../config/firebase';
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';
import CustomTextArea from '../components/CustomTextArea';
import { generateAutoNumber } from '../utils/functions';

const MedicineDonation = () => {
     const navigation = useNavigation();
     const route = useRoute();
     const { activeUser } = useContext(AuthContext);
     const initialState = {
          title: '',
          desc: '',
          donorName: '',
          mobileNo: '',
          pickupAddress: '',
     }
     const handleToast = (type, text1, text2) => {
          Toast.show({
               type: type,
               text1: text1,
               text2: text2,
               topOffset: 50,
          });
     }
     const mobileRegex = /^(\+92|0)[0-9]{3}-[0-9]{7}$/;
     const storage = getStorage();
     const metadata = {
          contentType: 'image/jpeg'
     };
     const [state, setState] = useState(initialState);
     const [medicines, setMedicines] = useState([]);

     const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
     const [isButtonPressed, setIsButtonPressed] = useState(false);
     const [isImageSelected, setIsImageSelected] = useState(false);
     const [location, setLocation] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState({
          title: '',
          desc: '',
          donorName: '',
          mobileNo: '',
          pickupAddress: '',
     });
     const addMedicine = () => {
          setMedicines([...medicines, { quantity: '', name: '', expiryDate: '' }]);
     };
     const validateForm = () => {
          let errors = {};
          if (!isImageSelected) {
               handleToast('error', 'Profile Image', 'Image Is required')
               return;
          } else if (!state.title) {
               errors.title = true;
               handleToast('error', 'Title', 'Please Enter Title of Donation')
          } else if (!state.donorName) {
               errors.desc = true;
               handleToast('error', 'Donor Name', 'Please Enter Donor Name.')
          } else if (!state.mobileNo) {
               errors.mobileNo = true;
               handleToast('error', 'Mobile Number', 'Mobile Number is required')
          } else if (state.mobileNo.length < 12 && state.mobileNo.length > 12) {
               errors.mobileNo = true;
               handleToast('error', 'Mobile Number', 'Mobile Number must be  11 digits')
          } else if (!mobileRegex.test(state.mobileNo)) {
               errors.mobileNo = true;
               handleToast('error', 'Mobile Number', 'Invalid mobile number')
          } else if (!state.pickupAddress) {
               errors.desc = true;
               handleToast('error', 'Pickup Address', 'Please Enter Pickup Address.')
          } else if (!location) {
               handleToast('error', 'Location', 'Location is required')
          } else
               setError(errors);

          return Object.keys(errors).length === 0;
     };

     const handleInputChange = (name, value) => {
          setState(prevState => ({
               ...prevState,
               [name]: value,
          }));
     };

     const handleMedicineChange = (index, field, value) => {
          const newMedicines = [...medicines];
          newMedicines[index][field] = value;
          setMedicines(newMedicines);
     };

     const handleMedicineDelete = (index) => {
          const newMedicines = [...medicines];
          newMedicines.splice(index, 1);
          setMedicines(newMedicines);
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
          // convert image into blob image 
          const response = await fetch(isImageSelected)
          const blob = await response.blob()
          // register users in firebase authentication
          const user = activeUser.uid;
          const userData = activeUser;
          const dontaionId = generateAutoNumber(15);
          // upload image on firebase storage 

          const storageRef = ref(storage, 'Medicine Images/' + Date.now());
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
                         setDoc(doc(firestoreDB, "Donations", dontaionId), {
                              donorImage: activeUser?.photoURL,
                              image: downloadURL,
                              ...state,
                              userlocation: location,
                              dateCreated: serverTimestamp(),
                              uid: user,
                              type: 'medicine',
                              status: 'PENDING',
                              donationId: dontaionId,
                              medicines: medicines
                         })

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
                         <Text style={styles.heading}>Medicine Donation</Text>
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
                                                       <Text style={{ fontSize: 20, lineHeight: 30, color: Color.textPrimary, letterSpacing: 1, textAlign: 'center' }}>Upload Medicines Image</Text>
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
                                        <CustomTextInput
                                             label="Donor Name"
                                             placeholder="Enter Donor Name"
                                             value={state.donorName}
                                             onChangeText={text => handleInputChange('donorName', text)}
                                             error={!!error.donorName && true}
                                        />
                                        <CustomTextInput
                                             label="Donor Mobile Number"
                                             placeholder="Enter Mobile Number"
                                             value={state.mobileNo}
                                             onChangeText={text => handleInputChange('mobileNo', text)}
                                             error={!!error.mobileNo && true}
                                             keyboardType="phone-pad"
                                             maxLength={12}
                                        />
                                        <CustomTextInput
                                             label="Pickup Address"
                                             placeholder="Enter Street Address"
                                             value={state.pickupAddress}
                                             onChangeText={text => handleInputChange('pickupAddress', text)}
                                             error={!!error.pickupAddress && true}
                                        />

                                        {/* Medicine Information */}
                                        <Title style={{fontWeight: '600', color: Color.primary}}>Add Medicine Information</Title>
                                        {medicines.map((medicine, index) => (
                                             <View key={index} style={styles.medicineItem}>
                                                  <CustomTextInput
                                                       label="Quantity"
                                                       placeholder="Enter Medicine Quantity"
                                                       value={medicine.quantity}
                                                       onChangeText={(value) => handleMedicineChange(index, 'quantity', value)}
                                                       keyboardType="phone-pad"
                                                  />
                                                  <CustomTextInput
                                                       label="Name (Brand & Generic)"
                                                       placeholder="Enter Medicine Name"
                                                       value={medicine.name}
                                                       onChangeText={(value) => handleMedicineChange(index, 'name', value)}

                                                  />

                                                  <CustomTextInput
                                                       label="Expire Date"
                                                       placeholder="Enter Medicine Name"
                                                       value={medicine.expiryDate}
                                                       onChangeText={(value) => handleMedicineChange(index, 'expiryDate', value)}

                                                  />
                                                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                       <HelperText type="error" visible={!medicine.expiryDate}>
                                                            Expiry Date is required
                                                       </HelperText>
                                                       <IconButton icon="delete" iconColor={Color.primary} background={Color.secondary} size={30} onPress={() => handleMedicineDelete(index)} />
                                                  </View>
                                             </View>
                                        ))}
                                   </View>

                                   <View style={styles.btnContainer}>
                                        <TouchableOpacity onPress={addMedicine}>
                                             <CustomeIconButton
                                                  title="Add Medicine"
                                                  isLoading={isLoading}
                                                  titleStyle={{ color: Color.primary }}
                                                  style={[styles.primaryBtn,]}
                                                  onPress={addMedicine}
                                                  leftIcon={!isLoading && <FontAwesome6 name="add" size={24} color={Color.primary} />}
                                             />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleSubmit}>
                                             <CustomeIconButton
                                                  title="Submit Donation"
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
          paddingVertical: '5%',
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
     primaryBtn: {
          borderWidth: 2,
          borderColor: Color.secondary,
          marginBottom: '5%'
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
     },
     text: {
          fontSize: 20,
          color: Color.textPrimary,
          marginLeft: '4%',
          marginBottom: 14,
          // letterSpacing: 1
     }
});


export default MedicineDonation;