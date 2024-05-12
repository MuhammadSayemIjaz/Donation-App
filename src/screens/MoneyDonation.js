import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import CustomTextInput from '../components/CustomTextInput';
import { StatusBar } from 'expo-status-bar';
import { Color } from '../../GlobalStyles';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
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
import { AuthContext } from '../context/AuthContext';

const MoneyDonation = () => {
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
          amount: "50 Rs",
     }
     const [state, setState] = useState(initialState);
     const [error, setError] = useState({
          amount: '',
     });
     const [selectedAmount, setSelectedAmount] = useState(null);

     const amounts = ["10 Rs", "50 Rs", "100 Rs", "500 Rs", "1000 Rs", "Other"];

     const handleAmountSelect = (amount) => {
          setSelectedAmount(amount);
          if (amount === "Other") {
               setState(prevState => ({
                    ...prevState,
                    amount: '',
               }));
          } else {
               setState(prevState => ({
                    ...prevState,
                    amount: amount,
               }));
          }
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
          if (!selectedAmount) {
               handleToast('error', 'Profile Image', 'Image Is required')
               return;
          } else if (selectedAmount === "Other" && !state.amount) {
               errors.amount = true;
               handleToast('error', 'Amount', 'Amount is required')
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


     const handleSubmit = async () => {
          console.log(selectedAmount);
          console.log(state.amount);
     };
     return (
          <SafeAreaView style={styles.container}>
               <StatusBar backgroundColor='transparent' translucent={false} style='dark' />
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <Ionicons name="arrow-back" size={26} color={Color.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.heading1}>Money Donation</Text>
               </View>
               <View style={styles.subContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                         <View style={styles.header}>
                              {/* <Text style={styles.heading}>Send your donations at below bank account</Text> */}
                              <View style={styles.content}>
                                   <View style={styles.bankContainer}>
                                        <Text style={styles.bankLable}>Bank Account Details</Text>
                                        <View style={styles.bankDetails}>
                                             <View style={styles.bankDetail}>
                                                  <FontAwesome name="bank" size={30} color={Color.primary} />
                                                  <Text style={styles.bankText}> Bank Name: Habib Bank Limited </Text>
                                             </View>
                                             <View style={styles.bankDetail}>
                                                  <FontAwesome name="university" size={30} color={Color.primary} />
                                                  <Text style={styles.bankText}>Account Title: John Doe</Text>
                                             </View>
                                             <View style={styles.bankDetail}>
                                                  <FontAwesome name="credit-card" size={30} color={Color.primary} />
                                                  <Text style={styles.bankText}>Account No: 123456789</Text>
                                             </View>
                                             <View style={styles.bankDetail}>
                                                  <FontAwesome name="money" size={30} color={Color.primary} />
                                                  <Text style={styles.bankText}>IBAN: PK123456789</Text>
                                             </View>
                                        </View>
                                   </View>
                                   <View style={styles.headingContainer}>
                                        <Text style={styles.label}>Select Amount</Text>
                                        <View style={styles.amountContainer}>
                                             {amounts.map((amount) => (
                                                  <TouchableOpacity
                                                       key={amount} // Key for each item in the list
                                                       style={[
                                                            styles.amountButton,
                                                            selectedAmount === amount && styles.selectedAmount,
                                                       ]}
                                                       onPress={() => handleAmountSelect(amount)}
                                                  >
                                                       <Text style={[styles.amountText,
                                                       selectedAmount === amount && { color: Color.white }
                                                       ]}>{amount}</Text>
                                                  </TouchableOpacity>
                                             ))}
                                        </View>
                                   </View>
                                   {selectedAmount === "Other" &&
                                        <View style={styles.inputContainer}>
                                             <CustomTextInput
                                                  label="Custom Amount"
                                                  placeholder="Enter Amount"
                                                  keyboardType="number-pad"
                                                  left={
                                                       <TextInput.Icon iconColor={Color.primary} icon="currency-usd" size={30} />
                                                  }
                                                  value={selectedAmount === "Other" ? state.amount : ''}
                                                  onChangeText={text => handleInputChange('amount', text)}
                                                  error={!!error.amount && true}
                                                  name="amount"
                                             />
                                        </View>
                                   }
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
          paddingHorizontal: '7%',
          paddingVertical: '5%',
     },
     subContainer: {
          marginTop: '3%',
          borderColor: 'white',
          borderRadius: 25,
          height: '100%',
          backgroundColor: Color.containerColor,
     },
     header: {
          // padding: '7%',
          height: '100%'
     },
     headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
     },
     heading1: {
          fontSize: 25,
          color: Color.textPrimary,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontWeight: '600',
          letterSpacing: 1
     },
     subHeading: {
          color: Color.heading2,
          fontSize: 20,
          width: '100%'
     },
     content: {
          width: '100%',
          alignItems: 'center',
          paddingBottom: 60,
     },
     inputContainer: {
          width: '100%',
          marginTop: '5%',
          marginBottom: '5%',
     },
     btnContainer: {
          width: '100%',
          marginTop: '5%',
     },
     btn: {
          backgroundColor: Color.primary,
          borderWidth: 1,
          borderColor: Color.primary,
     },
     label: {
          fontSize: 25,
          marginBottom: 10,
          fontWeight: 'bold',
          textAlign: 'center',
          letterSpacing: 1
     },
     amountContainer: {
          marginTop: '5%',
          flexDirection: 'row',
          flexWrap: 'wrap', // Allows buttons to wrap to next line if needed
     },
     amountButton: {
          width: '30%',
          paddingVertical: '7%',
          margin: 5,
          borderRadius: 5,
          alignItems: 'center',
          backgroundColor: Color.white,
          borderWidth: 1,
          borderColor: Color.textGray,
     },
     selectedAmount: {
          backgroundColor: Color.primary,
     },
     amountText: {
          fontSize: 20,
          fontWeight: 'bold',
     },
     headingContainer: {
          marginTop: '5%',
     },
     bankContainer: {
          width: '100%',
          marginTop: '10%',
     },
     bankDetails: {
          marginTop: '5%',
          width: '100%',
          // justifyContent: 'center',
          // alignItems: 'center',
     },
     bankDetail: {
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'center',
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: Color.textGray,
          paddingBottom: 10,
          gap: 10,
     },
     bankText: {
          fontSize: 18,
          fontWeight: 'bold',
     },
     bankLable: {
          fontSize: 23,
          fontWeight: 'bold',
          letterSpacing: 1,
          color: Color.primary,
     }

});

export default MoneyDonation;
