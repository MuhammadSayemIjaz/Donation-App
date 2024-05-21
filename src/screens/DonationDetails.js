import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { Color } from '../../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ref as DBRef, onValue, set, push, getDatabase, ref } from 'firebase/database';
import { where } from 'firebase/firestore';
import VerificationModel from '../components/VerificationModel';
import CustomeIconButton from '../components/CustomeIconButton';
import ImageView from "react-native-image-viewing";

const DonationDetails = ({ navigation, route }) => {
     console.log(route.params.item);
     console.log(route);
     const { role } = useContext(AuthContext);
     const { item } = route.params;
     const { activeUser } = useContext(AuthContext)
     const [isLoading, setIsLoading] = useState(false);
     const [donation, setDonation] = useState([]);
     const [state, setState] = useState({});
     const [isModalVisible, setModalVisible] = useState(false);
     const [donationStatus, setDonationStatus] = useState('PENDING');
     const [visible, setIsVisible] = useState(false);
     const [images, setImages] = useState([]);
     const timestampObject = item.dateCreated;

     // Combine seconds and nanoseconds into milliseconds
     const milliseconds = timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1000000;

     // Create a Date object from the milliseconds
     const date = new Date(milliseconds);

     // Extract date and time components
     const year = date.getFullYear();
     const month = date.getMonth() + 1; // Months are zero-indexed (January is 0)
     const day = date.getDate();
     const hours = date.getHours();
     const minutes = date.getMinutes();
     const seconds = date.getSeconds();
     const millisecondsFormatted = date.getMilliseconds().toString().padStart(3, '0'); // Pad with leading zeros

     // Format the date and time according to your desired format
     const formattedDate = `${month?.toString().padStart(2, '0')}/${day?.toString().padStart(2, '0')}/${year}`;
     const formattedTime = `${hours?.toString().padStart(2, '0')}:${minutes?.toString().padStart(2, '0')}:${seconds?.toString().padStart(2, '0')}.${millisecondsFormatted}`;
     const formattedDateTime = `${formattedDate} ${formattedTime}`;


     const handleToggle = (status) => {
          setDonationStatus(status);
          setModalVisible(!isModalVisible);
     }
     const handleImageView = (image) => {
          setImages([
               {
                    uri: image,
               },
          ]);
          setIsVisible(true);
     }
     // console.log("activeUser", activeUser);
     //     const getDriverLocation = () => {
     //         const driverRef = DBRef(db, `drivers/${activeUser?.uid}`);
     //         onValue(driverRef, (snapshot) => {
     //             const userData = snapshot.val();
     //             const { currentlocation } = userData;
     //             const { longitude, latitude } = currentlocation;
     //             setState({
     //                 longitude,
     //                 latitude,
     //             })
     //         });
     //     }
     // const collectionName = "Donations";
     // const ambuquerry = doc(firestoreDB, collectionName);
     //     const getPreviousRides = () => {
     //         setIsLoading(true)
     //         const ridesRef = ref(db, `bookings/${activeUser?.uid}`, limit(3));
     //         onValue(ridesRef, (snapshot) => {
     //             const data = snapshot.val();
     //             if (data) {
     //                 const rides = Object.keys(data).map((ridesID) => ({
     //                     ridesID,
     //                     ...data[ridesID],
     //                 }));
     //                 const filterRides = rides.filter((val) => {
     //                     return val.status === 'completed'
     //                   });
     //                 setDonation(filterRides);
     //             } else {
     //                 setDonation([]);
     //             }
     //             setIsLoading(false);
     //         });
     //     }
     //     useEffect(() => {
     //         getPreviousRides()
     //     }, []);

     // const readDocs = async () => {
     //      setIsLoading(true)
     //      let donations = [];
     //      const querySnapshot = await getDocs(ambuQuerry);
     //      querySnapshot.forEach((doc) => {
     //           donations.push(doc.data());
     //      });
     //      setDonation([...donations]);
     //      setIsLoading(false)
     // };

     // useEffect(() => {
     //      readDocs()
     // }, [])
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: '5%' }}>
                         <Text style={styles.baner}>Type : {item?.type?.toUpperCase()}</Text>
                         <Text style={[styles.baner,
                         { backgroundColor: item?.status === 'REJECTED' ? 'red' : item?.status === 'APPROVED' ? 'green' : item?.status === 'RECEIVED' ? 'blue' : 'orange' }
                         ]}>{item?.status?.toUpperCase()}</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                         <View style={styles.content}>

                              <View >
                                   <Text style={styles.title}>{item?.title}</Text>
                                   <Text style={styles.desc}>{item?.desc}</Text>
                              </View>
                              <Text style={[styles.title, { marginTop: '5%' }]}>Donor Details</Text>
                              {item?.pickupAddress &&
                                   <View style={{ marginTop: '2%', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.desc}>Pickup Address : <Text style={{ fontWeight: '600' }}>{item?.pickupAddress}</Text></Text>
                                   </View>
                              }

                              <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                   <Text style={styles.desc}>Date: </Text>
                                   <Text style={[styles.desc, { fontWeight: '600' }]}>{formattedDate} </Text>
                              </View>
                              {
                                   item?.type === 'blood' && <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <Text style={styles.desc}>Blood Group: </Text>
                                        <Text style={[styles.desc, { fontWeight: '600' }]}>{item?.data}</Text>
                                   </View>
                              }
                              {
                                   item?.amount && <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <Text style={styles.desc}>Amount: </Text>
                                        <Text style={[styles.desc, { fontWeight: '600' }]}>{item?.amount} Rs.</Text>
                                   </View>
                              }
                              {item?.clothSize &&
                                   <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <Text style={styles.desc}>Cloth Size: </Text>
                                        <Text style={[styles.desc, { fontWeight: '600' }]}>{item?.clothSize} </Text>
                                   </View>
                              }
                              {item?.clothTypes &&
                                   <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <Text style={styles.desc}>Cloth Types: </Text>
                                        <Text style={[styles.desc, { fontWeight: '600' }]}> {item?.clothTypes.map((type, ind) => (<Text key={ind}>{type + ','} </Text>))} </Text>
                                   </View>
                              }
                              {item?.foodTypes &&
                                   <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <Text style={styles.desc}>Food Types: </Text>
                                        <Text style={[styles.desc, { fontWeight: '600' }]}> {item?.foodTypes.map((type, ind) => (<Text key={ind}>{type + ','} </Text>))} </Text>
                                   </View>
                              }
                              {item?.clothCondition &&
                                   <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <Text style={styles.desc}>Cloth Condition: </Text>
                                        <Text style={[styles.desc, { fontWeight: '600' }]}> {item?.clothCondition} </Text>
                                   </View>
                              }
                              {item?.quantity && <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                   <Text style={styles.desc}>Quantity : </Text>
                                   <Text style={[styles.desc, { fontWeight: '600' }]}>{item?.quantity}</Text>
                              </View>}
                              {item?.type === 'money' && <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                   <Text style={styles.desc}>Charity : </Text>
                                   <Text style={[styles.desc, { fontWeight: '600' }]}>{item?.amount}.</Text>
                              </View>}
                              {item?.donorName && <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                   <Text style={styles.desc}>Donor Name: </Text>
                                   <Text style={[styles.desc, { fontWeight: '600' }]}>{item?.donorName}</Text>
                              </View>}
                              {item?.donorAge &&
                                   <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <Text style={styles.desc}>Donor Age: </Text>
                                        <Text style={[styles.desc, { fontWeight: '600' }]}>{item?.donorAge} Years</Text>
                                   </View>
                              }
                               <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
                                   <Text style={styles.desc}>Donor Image: </Text>
                                   <TouchableOpacity style={styles.imageContainer1} onPress={() => handleImageView(item?.donorImage)}>
                                        <Image source={{ uri: item?.donorImage }} style={styles.image1} />
                                   </TouchableOpacity>
                              </View>
                              {item?.medicines && item?.medicines.length > 0 && item?.medicines.map((medicine, index) => (
                                   <View key={index}>
                                        <Text style={styles.title}>Medicine {index + 1} Details</Text>
                                        <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                             <Text style={styles.desc}>Medicine Name: </Text>
                                             <Text style={[styles.desc, { fontWeight: '600' }]}>{medicine?.name} </Text>
                                        </View>
                                        <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                             <Text style={styles.desc}>Expiry Date: </Text>
                                             <Text style={[styles.desc, { fontWeight: '600' }]}>{medicine?.expiryDate} </Text>
                                        </View>
                                        <View style={{ marginTop: '4%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                             <Text style={styles.desc}>Quantity: </Text>
                                             <Text style={[styles.desc, { fontWeight: '600' }]}>{medicine?.quantity} </Text>
                                        </View>
                                   </View>
                              ))}


                             
                              <TouchableOpacity style={styles.imageContainer} onPress={() => handleImageView(item?.image)}>
                                   <Image source={{ uri: item?.image }} style={styles.image} />
                              </TouchableOpacity>
                              {
                                   (role.toLowerCase() === 'admin' && item?.status === 'PENDING') && <CustomeIconButton
                                        leftIcon={
                                             <FontAwesome6 name="file-circle-check" size={24} color={Color.primary} />
                                        }
                                        title={"Verify Document"}
                                        style={styles.btn}
                                        titleStyle={{
                                             color: Color.primary
                                        }}
                                        onPress={() => handleToggle('APPROVED')}
                                   />
                              }
                              {
                                   (role.toLowerCase() === 'receiver' && item?.status === 'APPROVED') && <CustomeIconButton
                                        leftIcon={
                                             <FontAwesome6 name="file-circle-check" size={24} color={Color.primary} />
                                        }
                                        title={"Received Donation"}
                                        style={styles.btn}
                                        titleStyle={{
                                             color: Color.primary
                                        }}
                                        onPress={() => handleToggle('RECEIVED')}
                                   />
                              }
                              <ImageView
                                   images={images}
                                   imageIndex={0}
                                   visible={visible}
                                   onRequestClose={() => setIsVisible(false)}
                              />
                              <VerificationModel isModalVisible={isModalVisible} toggleModal={handleToggle} donationId={item?.donationId} donationStatus={donationStatus} />
                         </View>
                    </ScrollView>
               </View>
          </SafeAreaView >
     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: Color.white,
     },
     subContainer: {
          height: '100%',
          paddingHorizontal: '7%',
          paddingVertical: '5%',
     },
     headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'center'
     },
     heading: {
          fontSize: 25,
          color: Color.textPrimary,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontWeight: '600',
          letterSpacing: 1
     },
     content: {
          flex: 1,
          // paddingTop: '10%'

     },
     imageContainer: {
          width: '100%',
          alignItems: 'center',
          marginVertical: '5%',
          // borderWidth: 1,
          height: 350,
     },
     imageContainer1: {
          width: 90,
          height: 90,

     },
     image: {
          width: '100%',
          aspectRatio: 1,
          objectFit: 'fill',
          height: '100%',
          borderRadius: 10
     },
     image1: {
          width: '100%',
          aspectRatio: 1,
          objectFit: 'fill',
          height: '100%',
          borderRadius: 10
     },
     title: {
          fontSize: 25,
          color: Color.primary,
          fontWeight: '600',
          marginBottom: '3%'
     },
     desc: {
          fontSize: 20,
          color: Color.textPrimary,
          textAlign: 'justify'
     },
     baner: {
          fontSize: 20,
          backgroundColor: Color.primary,
          color: Color.white,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 5,
          fontWeight: '600'
     },
     btn: {
          borderWidth: 1,
          borderColor: Color.primary,
     }
});

export default DonationDetails;
