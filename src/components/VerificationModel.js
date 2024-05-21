import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Color } from '../../GlobalStyles';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import CustomeIconButton from './CustomeIconButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { firestoreDB1 } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';


const VerificationModel = ({ toggleModal, isModalVisible, donationId, donationStatus }) => {
     const navigation = useNavigation();
     const [data, setData] = React.useState({});
     const [isLoading, setIsLoading] = React.useState(false);
     const { activeUser } = React.useContext(AuthContext);
     console.log("donationStatus", donationStatus);
     const handleToast = (type, text1, text2) => {
          Toast.show({
               type: type,
               text1: text1,
               text2: text2,
               topOffset: 50,
          });
     }
     const handleVerify = async () => {
          setIsLoading(true);
          const updateDonationStatus = async (donationStatus) => {
               const data = {
                    status: donationStatus,
               };

               if (donationStatus === 'APPROVED') {
                    data.approvedDate = new Date();
                    data.approvedByName = activeUser?.displayName;
                    data.approvedByEmail = activeUser?.email;
                    data.approvedById = activeUser?.uid;

               } else if (donationStatus === 'REJECTED') {
                    data.rejectedDate = new Date();
                    data.rejectedByName = activeUser?.displayName;
                    data.rejectedByEmail = activeUser?.email;
                    data.rejectedById = activeUser?.uid;

               } else if (donationStatus === 'RECEIVED') {
                    data.receivedDate = new Date();
                    data.receivedByName = activeUser?.displayName;
                    data.receivedByEmail = activeUser?.email;
                    data.receivedById = activeUser?.uid;
               }

               try {
                    const donationRef = doc(collection(firestoreDB1, 'Donations'), donationId);
                    await updateDoc(donationRef, data);
                    const successMessage = donationStatus === 'RECEIVED' ? 'Donation Received' : 'Donation Verified';
                    handleToast('success', successMessage, 'Donation Requeset Fullfilled Successfully');
                    setIsLoading(false);
                    navigation.navigate('DrawerNavigation');
                    toggleModal();
               } catch (error) {
                    console.log(error);
                    handleToast('error', 'Error', 'Something went wrong');
               }
          };

          if (donationStatus === 'APPROVED' || donationStatus === 'REJECTED' || donationStatus === 'RECEIVED') {
               updateDonationStatus(donationStatus);
          }
     }

     return (<>
          <View>
               <Modal isVisible={isModalVisible} animationIn={'fadeInLeft'} swipeDirection={'right'} style={{ backgroundColor: 'white', borderRadius: 10, paddingHorizontal: '5%', marginTop: 'auto', marginBottom: 'auto', maxHeight: 250 }}>
                    <View style={styles.modal}>
                         <TouchableOpacity activeOpacity={0.5} onPress={() => toggleModal()} style={styles.iconContanier}>
                              <Text style={[styles.label]}>{donationStatus == 'RECEIVED' ? 'Receive' : 'Verify'} Donation ?</Text>
                              <Ionicons name="close" size={28} color={Color.backgroundColorPrimary} />
                         </TouchableOpacity>
                         <View style={styles.btnConatiner}>
                              <TouchableOpacity activeOpacity={0.3} >
                                   <CustomeIconButton
                                        leftIcon={!isLoading &&
                                             <FontAwesome6 name="file-circle-check" size={24} color={Color.white} />
                                        }
                                        title={donationStatus === 'RECEIVED' ? 'Receive Donation' : "Verify Donation"}
                                        style={styles.callBtn}
                                        titleStyle={{
                                             color: Color.white
                                        }}
                                        isLoading={isLoading}
                                        onPress={handleVerify}
                                   />
                              </TouchableOpacity>
                         </View>
                    </View>
               </Modal>
          </View>
     </>
     );
};

export default VerificationModel;

const styles = StyleSheet.create({
     callContainer: {
          marginBottom: 20,
          paddingHorizontal: 30,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 60
     },
     iconContanier: {
          marginBottom: 10,
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
     },
     callBtn: {
          backgroundColor: Color.primary,
     },
     label: {
          padding: 4,
          fontSize: 30,
          marginLeft: 'auto',
          marginRight: 'auto'
     },
     modal: {
          flex: 1,
          alignItems: 'center',
     },


     mainHeading: {
          marginTop: 10,
          width: '50%'
     },
     btnConatiner: {
          width: '100%',
          paddingHorizontal: '7%',
          marginTop: '10%'
     },
});
