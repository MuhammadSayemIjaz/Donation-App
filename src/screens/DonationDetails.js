import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { Color } from '../../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firestoreDB } from '../config/firebase';
import { collection, getDocs, limit, query } from "firebase/firestore/lite";
import { ActivityIndicator } from 'react-native-paper';
import { isEmpty, startCase } from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ref as DBRef, onValue, set, push, getDatabase, ref } from 'firebase/database';
import { Fontisto } from '@expo/vector-icons';
import { where } from 'firebase/firestore';


const DonationDetails = ({ navigation, route }) => {
     console.log(route.params.item);
     const { item } = route.params;
     const { activeUser } = useContext(AuthContext)
     const [isLoading, setIsLoading] = useState(false);
     const [donation, setDonation] = useState([]);
     const [state, setState] = useState({});

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
     const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millisecondsFormatted}`;
     const formattedDateTime = `${formattedDate} ${formattedTime}`;

     console.log("Date:", formattedDate);
     console.log("Time:", formattedTime);
     console.log("Date and Time:", formattedDateTime);
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                         <View style={styles.content}>
                              <View >
                                   <Text style={styles.title}>{item?.title}</Text>
                                   <Text style={styles.desc}>{item?.desc}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '5%' }}>
                                   <Text style={styles.baner}>Type : {item?.type?.toUpperCase()}</Text>
                                   <Text style={[styles.baner,
                                   { backgroundColor: item?.status === 'pending' ? 'red' : item?.status === 'completed' ? 'green' : 'orange' }
                                   ]}>{item?.status?.toUpperCase()}</Text>
                              </View>
                              <View style={styles.imageContainer}>
                                   <Image source={{ uri: item?.image }} style={styles.image} />
                              </View>
                              <Text style={styles.title}>Donation Details</Text>
                              <View style={{ marginTop: '2%', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                   <FontAwesome6 name="location-dot" size={24} color={Color.primary} />
                                   <Text style={styles.desc}>Pickup Address : {item?.pickupAddress}</Text>
                              </View>
                              <View style={{ marginTop: '4%', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                   <Text style={styles.desc}>Date: {formattedDate}</Text>
                              </View>
                              <View style={{ marginTop: '4%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                   <Text style={styles.desc}>Blood Group:</Text>
                                   <Text style={[styles.desc, { fontWeight: '600' }]}>{item?.data}</Text>
                              </View>
                              <View style={{ marginTop: '4%', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                   <Text style={styles.desc}>Donor Age: {formattedDate}</Text>
                              </View>
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
          paddingTop: '10%'

     },
     imageContainer: {
          width: '100%',
          alignItems: 'center',
          marginVertical: '5%',
          // borderWidth: 1,
          height: 350,
     },
     image: {
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
     }
});

export default DonationDetails;
