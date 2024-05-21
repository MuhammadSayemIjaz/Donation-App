import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import CustomTextInput from '../components/CustomTextInput';
import { StatusBar } from 'expo-status-bar';
import { Color } from '../../GlobalStyles';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import CustomeIconButton from '../components/CustomeIconButton';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/AuthContext';

const BloodDonation = () => {
     const { activeUser, setActiveUser } = useContext(AuthContext);
     const navigation = useNavigation();
     const [isLoading, setIsLoading] = useState(false);
     const initialState = {
          amount: "A",
     }
     const [state, setState] = useState(initialState);
     const [selected, setSelected] = useState('+');
     const [error, setError] = useState({
          amount: '',
     });
     const [selectedAmount, setSelectedAmount] = useState("A");

     const bloodGroups = ["A", "B", "O", "AB", "HH"];

     const handleAmountSelect = (amount) => {
          setSelectedAmount(amount);
     };
     const handlePress = (option) => {
          setSelected(option);
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
               handleToast('error', 'Blood Group Not Selected', 'Please select Blood Group')
               return;
          }
          setError(errors);

          return Object.keys(errors).length === 0;
     };

     const handleSubmit = async () => {
          setIsLoading(true);
          navigation.navigate('BloodDonarDetails', {data: `${selectedAmount}${selected}`});
          setIsLoading(false);
     };
     return (
          <SafeAreaView style={styles.container}>
               <StatusBar backgroundColor='transparent' translucent={false} style='dark' />
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <Ionicons name="arrow-back" size={26} color={Color.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.heading1}>Pick up Your Blood Group</Text>
               </View>
               <View style={styles.subContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                         <View style={styles.header}>
                              {/* <Text style={styles.heading}>Send your donations at below bank account</Text> */}
                              <View style={styles.content}>
                                   <View style={styles.headingContainer}>
                                        <View style={styles.amountContainer}>
                                             {bloodGroups.map((bloodgroup) => (
                                                  <TouchableOpacity
                                                       key={bloodgroup}
                                                       style={[
                                                            styles.amountButton,
                                                            selectedAmount === bloodgroup && styles.selectedAmount,
                                                       ]}
                                                       onPress={() => handleAmountSelect(bloodgroup)}
                                                  >
                                                       <Text style={[styles.amountText,
                                                       selectedAmount === bloodgroup && { color: Color.white }
                                                       ]}>{bloodgroup}</Text>
                                                  </TouchableOpacity>
                                             ))}
                                        </View>
                                   </View>
                                   <View style={[styles.amountContainer, { marginTop: '20%' }]}>
                                        <TouchableOpacity
                                             style={[styles.signButton, selected === '+' && styles.selectedAmount]}
                                             onPress={() => handlePress('+')}
                                        >
                                             <Text style={[styles.amountText,
                                             selected === '+' && { color: Color.white }
                                             ]}>+</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                             style={[styles.signButton, selected === '-' && styles.selectedAmount]}
                                             onPress={() => handlePress('-')}
                                        >
                                             <Text style={[styles.amountText,
                                             selected === '-' && { color: Color.white }
                                             ]}>-</Text>
                                        </TouchableOpacity>
                                   </View>
                                   <View style={styles.btnContainer}>
                                        <TouchableOpacity onPress={handleSubmit}>
                                             <CustomeIconButton
                                                  title="Continue"
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
          fontSize: 23,
          color: Color.textPrimary,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontWeight: '600',
          // letterSpacing: 1
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
          marginTop: '25%',
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
          flexWrap: 'wrap',
          gap: 10,
     },
     amountButton: {
          width: '45%',
          paddingVertical: '9%',
          margin: 5,
          borderRadius: 5,
          alignItems: 'center',
          backgroundColor: Color.secondary,
     },
     signButton: {
          width: '25%',
          paddingVertical: '5%',
          margin: 5,
          borderRadius: 5,
          alignItems: 'center',
          backgroundColor: Color.secondary,
     },
     selectedAmount: {
          backgroundColor: Color.primary,
     },
     amountText: {
          fontSize: 30,
          fontWeight: 'bold',
          color: Color.primary
     },
     headingContainer: {
          marginTop: '6%',
     },

});

export default BloodDonation;
