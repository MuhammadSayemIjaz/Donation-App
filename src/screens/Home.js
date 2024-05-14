import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { Color } from '../../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
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


const Home = ({ navigation }) => {
     const { activeUser } = useContext(AuthContext)
     const [isLoading, setIsLoading] = useState(false);
     const [donation, setDonation] = useState([]);
     const [state, setState] = useState({});
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
     const collectionName = "Donations";
     const collectionRef = collection(firestoreDB, collectionName);
     const ambuQuerry = query(collectionRef, limit(3))

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

     const readDocs = async () => {
          setIsLoading(true)
          let donations = [];
          const querySnapshot = await getDocs(ambuQuerry);
          querySnapshot.forEach((doc) => {
               donations.push(doc.data());
          });
          // console.log(donations);
          setDonation([...donations]);
          setIsLoading(false)
     };

     useEffect(() => {
          readDocs()
     }, [])
     return (
          <SafeAreaView style={styles.container}>
               <StatusBar backgroundColor='transparent' translucent={true} style='light' />
               <View style={styles.header1}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.openDrawer()} >
                         <Ionicons name="menu" size={35} color={Color.textSecondary} />
                    </TouchableOpacity>
                    {/* <Image style={styles.headimg1} source={require('../../../assets/images/ambulog.png')} /> */}
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('DriverAccountDetails')} >
                         {!isEmpty(activeUser?.photoURL) ?
                              <Image style={styles.headimg3} source={{ uri: activeUser?.photoURL }} />
                              :
                              <Ionicons style={styles.headimg3} name="search-outline" size={22} color={Color.primary} />
                         }
                    </TouchableOpacity>
               </View>
               <View style={{ paddingHorizontal: '7%', marginTop: '4%' }}>
                    <Text style={{ fontSize: 25, fontWeight: "700", letterSpacing: 1, color: Color.textSecondary }}>Hello, {activeUser?.displayName}</Text>
                    <Text style={{ marginTop: '3%', letterSpacing: 1, color: Color.textSecondary, fontSize: 17 }}>What do you wanna donate today? </Text>
               </View>
               <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('PreviousRides')}>
                    <View style={styles.searchContainer}>
                         <View style={styles.searchBar}>
                              <Ionicons name="search-outline" size={22} color={Color.primary} />
                              <Text style={styles.drivertext}>Search here</Text>
                         </View>
                         <View style={styles.filterContainer}>
                              <Ionicons name="options-outline" size={30} color={Color.primary} />
                         </View>
                    </View>
               </TouchableOpacity>
               <View style={{ paddingHorizontal: '5%', paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20, fontWeight: "700", letterSpacing: 1, color: Color.textSecondary }}>Categories</Text>
                    {/* <TouchableOpacity activeOpacity={0.5} > */}
                         <Text onPress={() => navigation.navigate('Categories')} style={{ fontSize: 20, fontWeight: "700", letterSpacing: 1, color: Color.textSecondary }}>View All</Text>
                    {/* </TouchableOpacity> */}
               </View>
               <View style={styles.card2}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('DriverHospitalAccountDetails')}>
                         <View style={styles.subcard}>
                              <FontAwesome5 name="money-bill-wave" size={36} color={Color.textSecondary} />
                              {/* <Text style={styles.cardtext}>See Hospital Details</Text> */}
                         </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('CurrentLocationMap', { currentLocation: state })}>
                         <View style={styles.subcard}>
                              <Ionicons name="fast-food-sharp" size={36} color={Color.textSecondary} />
                              {/* <Entypo name="location"  /> */}
                              {/* <Text style={styles.cardtext}>Current Location</Text> */}
                         </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('DriverNotification')}>
                         <View style={styles.subcard}>
                              <Fontisto name="blood-drop" size={36} color={Color.textSecondary} />
                              {/* <Text style={styles.cardtext}>Notifications</Text> */}
                         </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('DriverAccountDetails')}>
                         <View style={styles.subcard}>
                              <Ionicons name="shirt" size={36} color={Color.textSecondary} />
                              {/* <Text style={styles.cardtext}>Account Settings</Text> */}
                         </View>
                    </TouchableOpacity>
               </View>
               <View style={styles.header}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                         <View style={styles.mainTextContainer}>
                              <Text style={styles.text}>Previous Donations</Text>
                              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('PreviousRides')}>
                                   <Text style={styles.text}>See All</Text>
                              </TouchableOpacity>

                         </View>
                         <View style={styles.bottomContainer}>
                              {isLoading ?
                                   (<View style={styles.loadingContainer}>
                                        <ActivityIndicator animating={true} size="large" color={Color.primary} />
                                   </View>) :
                                   (isEmpty(donation) ?
                                        <View style={styles.imageContainer}>
                                             <Image style={styles.emptyImage} source={require('../../assets/images/EmptyList.png')} />
                                             <Text style={styles.heading}>Empty List</Text>
                                        </View> :
                                        donation.map((donation, ind) => (
                                             <View key={ind}>
                                                  <View style={styles.card}>
                                                       <View style={styles.iconContainer}>
                                                            <View style={styles.logoimage}>
                                                                 <Image style={styles.logoimage} resizeMode="contain" source={{ uri: activeUser?.photoURL }} />
                                                            </View>
                                                       </View>
                                                       <View style={styles.cardTextContainer}>
                                                            <Text style={styles.cardSubHeading}>{startCase(donation?.title)}</Text>
                                                            <View style={styles.cardHeaderContainer}>
                                                                 <Text style={styles.cardText}>{new Date(donation?.dateCreated).toLocaleDateString()}</Text>
                                                            </View>
                                                       </View>
                                                  </View>
                                             </View>
                                        ))
                                   )}
                         </View>
                    </ScrollView>
               </View>
          </SafeAreaView >
     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: Color.primary,
     },

     searchtext: {
          paddingHorizontal: '7%',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10%',
          backgroundColor: Color.textSecondary,
          paddingVertical: 9,
          marginHorizontal: 20,
          borderRadius: 10,
     },
     searchimage: {
          height: 30,
          width: 30,
          marginLeft: -260,
          marginTop: 10


     },
     header1: {
          marginTop: '10%',
          height: 50,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: '7%'
     },
     headimg: {
          height: 25,
          width: 25,
     },
     headimg1: {
          height: 40,
          width: 70,
     },
     headimg3: {
          height: 45,
          width: 45,
          borderRadius: 60,
          borderWidth: 2,
          borderColor: Color.textSecondary,
     },
     searchContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: '5%',
          marginTop: '7%'
     },
     searchBar: {
          backgroundColor: Color.textSecondary,
          paddingHorizontal: '5%',
          alignItems: 'center',
          flexDirection: 'row',
          height: 60,
          width: '80%',
          borderRadius: 10,
     },
     drivertext: {
          color: Color.primary,
          fontSize: 20,
          alignItems: 'center',
          marginLeft: '4%'
     },
     filterContainer: {
          width: '17%',
          height: 60,
          borderRadius: 10,
          backgroundColor: Color.textSecondary,
          justifyContent: 'center',
          alignItems: 'center'
     },
     cardConatiner: {
          marginTop: '15%',
          gap: 15,
     },
     card2: {
          width: '100%',
          marginTop: '5%',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: '5%',
          gap: 15,
     },
     card3: {
          borderWidth: 2,
          borderColor: Color.borderColor,
          marginTop: 5,
          width: '100%',
          height: 80,
          backgroundColor: Color.textSecondary,
          borderRadius: 20,
          justifyContent: 'space-evenly',
     },
     subcard: {
          width: 80,
          height: 80,
          borderWidth: 2,
          borderRadius: 20,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          padding: '3%',
          borderColor: Color.textSecondary,
     },
     cardtext: {
          color: Color.textSecondary,
          fontSize: 20,
          textAlign: 'center',
     },

     mainTextContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
     },
     text: {
          fontSize: 20,
          color: Color.primary
     },
     header: {
          marginTop: '5%',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 25,
          height: '100%',
          padding: '7%',
          backgroundColor: Color.textSecondary
     },
     heading: {
          marginTop: '10%',
          color: Color.heading1,
          fontSize: 20,
          textAlign: 'center'
     },
     subHeading: {
          color: Color.heading2,
          fontSize: 20,
          textAlign: 'center'
     },
     card: {
          borderWidth: 2,
          borderColor: Color.borderColor,
          borderRadius: 20,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          height: 100,
          padding: '5%',
     },
     iconContainer: {
          width: '20%',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
     },
     logoimage: {
          borderColor: Color.borderColor,
          borderRadius: 10,
          width: '100%',
          height: 70,
          width: 70,
     },
     cardTextContainer: {
          width: '76%',
          marginLeft: '5%',
          height: '100%'
     },
     cardSubHeading: {
          fontSize: 15,
          letterSpacing: 1,
     },
     cardText: {
          color: Color.heading1,
          fontSize: 20,
          textShadowColor: 'rgba(0, 0, 0, 0.2)',
          textShadowRadius: 10,
     },
     cardHeaderContainer: {
          flexDirection: 'row',
          marginBottom: 2,
     },
     bottomContainer: {
          marginTop: '5%',
          gap: 10
     },
     userimage: {
          height: 20,
          width: 30,

     },
     imageContainer: {
          height: 300,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10%'
     },
     image: {
          width: '100%',
          height: '100%',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
     },
     loadingContainer: {
          height: 300,
          justifyContent: 'center',
          alignItems: 'center'
     },
     emptyImage: {
          width: '100%',
          height: 'auto',
          aspectRatio: 2 / 1
     },
});

export default Home;
