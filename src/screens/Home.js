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
import { collection, getDocs, limit, query, where } from "firebase/firestore/lite";
import { ActivityIndicator } from 'react-native-paper';
import { isEmpty, startCase } from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ref as DBRef, onValue, set, push, getDatabase, ref } from 'firebase/database';
import { Fontisto } from '@expo/vector-icons';
import { getFormatedDate, getFormatedTime } from '../utils/functions';

const Home = ({ navigation }) => {
     const { activeUser, userData, role } = useContext(AuthContext);
     const [isLoading, setIsLoading] = useState(false);
     const [donation, setDonation] = useState([]);
     const [totalDonation, setTotalDonation] = useState(0);
     const [approvedDonation, setApprovedDonation] = useState(0);
     const [pendingDonation, setPendingDonation] = useState(0);
     const [receivedDonation, setReceivedDonation] = useState(0);
     const [state, setState] = useState({});
     const [donations1, setDonations] = useState();
     console.log("role", role);
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
     const ambuQuerry = role?.toLowerCase() == 'donor' ?
          query(collectionRef, where("uid", "==", activeUser?.uid), limit(3))
          :
          role?.toLowerCase() == 'receiver' ?
               query(collectionRef, where("receivedById", "==", activeUser?.uid), limit(3)) :
               query(collectionRef);

     console.log("userData", role);

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
     const calculateTotals = (donations) => {
          const totals = {
               total: 0,
               pending: 0,
               approved: 0,
               received: 0,
          };

          donations.forEach((donation) => {
               if (donation.status === 'PENDING') {
                    totals.pending += 1;
               } else if (donation.status === 'APPROVED') {
                    totals.approved += 1;
               } else if (donation.status === 'RECEIVED') {
                    totals.received += 1;
               }
          });

          setDonations(totals)
          return totals;
     };


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
          setTotalDonation(donations.length);
          if (role === 'admin') {
               const response = calculateTotals(donations);
               
               console.log("donations response", donations1);
          }
     };
     console.log(donation.length);

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
                    {role !== 'admin' && <Text style={{ marginTop: '3%', letterSpacing: 1, color: Color.textSecondary, fontSize: 17 }}>What do you wanna donate today? </Text>}
               </View>
               <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('DonationsSearchList')}>
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
               {
                    role !== 'admin' && <>
                         <View style={{ paddingHorizontal: '5%', paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={{ fontSize: 20, fontWeight: "700", letterSpacing: 1, color: Color.textSecondary }}>Categories</Text>
                              {/* <TouchableOpacity activeOpacity={0.5} > */}
                              <Text onPress={() => navigation.navigate('Categories')} style={{ fontSize: 20, fontWeight: "700", letterSpacing: 1, color: Color.textSecondary }}>View All</Text>
                              {/* </TouchableOpacity> */}
                         </View>
                         {role !== 'receiver' && <View style={styles.card2}>
                              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('MoneyDonation')}>
                                   <View style={styles.subcard}>
                                        <FontAwesome5 name="money-bill-wave" size={36} color={Color.textSecondary} />
                                        {/* <Text style={styles.cardtext}>See Hospital Details</Text> */}
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('FoodDonation')}>
                                   <View style={styles.subcard}>
                                        <Ionicons name="fast-food-sharp" size={36} color={Color.textSecondary} />
                                        {/* <Entypo name="location"  /> */}
                                        {/* <Text style={styles.cardtext}>Current Location</Text> */}
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('BloodDonation')}>
                                   <View style={styles.subcard}>
                                        <Fontisto name="blood-drop" size={36} color={Color.textSecondary} />
                                        {/* <Text style={styles.cardtext}>Notifications</Text> */}
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('ClothDonation')}>
                                   <View style={styles.subcard}>
                                        <Ionicons name="shirt" size={36} color={Color.textSecondary} />
                                        {/* <Text style={styles.cardtext}>Account Settings</Text> */}
                                   </View>
                              </TouchableOpacity>
                         </View>}
                         {role === 'receiver' && <View style={styles.card2}>
                              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('ReceiverSearchList', { type: 'charity' })}>
                                   <View style={styles.subcard}>
                                        <FontAwesome5 name="money-bill-wave" size={36} color={Color.textSecondary} />
                                        {/* <Text style={styles.cardtext}>See Hospital Details</Text> */}
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('ReceiverSearchList', { type: 'food' })}>
                                   <View style={styles.subcard}>
                                        <Ionicons name="fast-food-sharp" size={36} color={Color.textSecondary} />
                                        {/* <Entypo name="location"  /> */}
                                        {/* <Text style={styles.cardtext}>Current Location</Text> */}
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('ReceiverSearchList', { type: 'blood' })}>
                                   <View style={styles.subcard}>
                                        <Fontisto name="blood-drop" size={36} color={Color.textSecondary} />
                                        {/* <Text style={styles.cardtext}>Notifications</Text> */}
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('ReceiverSearchList', { type: 'cloths' })}>
                                   <View style={styles.subcard}>
                                        <Ionicons name="shirt" size={36} color={Color.textSecondary} />
                                        {/* <Text style={styles.cardtext}>Account Settings</Text> */}
                                   </View>
                              </TouchableOpacity>
                         </View>}

                         <ScrollView showsVerticalScrollIndicator={false}>
                              <View style={styles.header}>
                                   <View style={styles.mainTextContainer}>
                                        <Text style={styles.text}>Previous Donations</Text>
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('DonationsSearchList')}>
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
                                                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('DonationDetails', { item: donation })}>
                                                                 <View style={[styles.card,
                                                                 donation?.status === 'PENDING' && { backgroundColor: 'orange' } ||
                                                                 donation?.status === 'APPROVED' && { backgroundColor: '#26CC00' } ||
                                                                 donation?.status === 'REJECTED' && { backgroundColor: 'red' } ||
                                                                 donation?.status === 'RECEIVED' && { backgroundColor: '#00BFFE' }
                                                                 ]} key={donation.uid}>
                                                                      {/* <View style={styles.iconContainer}>
                                                            <View style={styles.logoimage}>
                                                                 <Image style={styles.logoimage} resizeMode="contain" source={{ uri: donation?.donorImage }} />
                                                            </View>
                                                       </View> */}
                                                                      <View style={styles.cardHeader}>
                                                                           <Text style={styles.cardHeaderText}>Posted On : {donation?.dateCreated && getFormatedDate(donation?.dateCreated)} </Text>
                                                                           <Text style={styles.cardHeaderText}>{donation?.dateCreated && getFormatedTime(donation?.dateCreated)} </Text>
                                                                      </View>
                                                                      <View style={styles.cardMainContainer}>
                                                                           <View style={styles.cardTextContainer}>
                                                                                <Text style={styles.cardText}>{donation?.title}</Text>
                                                                                <Text style={styles.cardSubHeading}>{donation?.desc}</Text>
                                                                                {/* <Text style={styles.cardSubHeading}>{donation?.type?.toUpperCase()}</Text> */}
                                                                           </View>
                                                                           <View style={styles.iconContainer}>
                                                                                <Text style={styles.icon}>{donation?.data}</Text>
                                                                                {/* <Entypo name="chevron-right" size={28} color={Color.primary} /> */}

                                                                           </View>
                                                                      </View>
                                                                      <View style={styles.cardFooterContainer}>
                                                                           <Text style={styles.type}>{donation?.type}</Text>
                                                                           <Text style={[styles.status,
                                                                           donation?.status === 'PENDING' && { backgroundColor: 'white' } ||
                                                                           donation?.status === 'APPROVED' && { backgroundColor: 'white' } ||
                                                                           donation?.status === 'REJECTED' && { backgroundColor: 'white' } ||
                                                                           donation?.status === 'RECEIVED' && { backgroundColor: 'white' }
                                                                           ]}>{donation?.status}</Text>
                                                                      </View>
                                                                 </View>
                                                            </TouchableOpacity>
                                                       </View>
                                                  ))
                                             )}
                                   </View>
                              </View>
                         </ScrollView>
                    </>
               }
               {
                    role === 'admin' && <>
                         <ScrollView showsVerticalScrollIndicator={false}>

                              <View style={styles.insightsContainer}>
                                   <TouchableOpacity style={[styles.insightsCard, { backgroundColor: Color.secondary, borderWidth: 2, borderColor: Color.primary }]} onPress={() => navigation.navigate('DonationsSearchList')}>
                                        <View style={[styles.insightCircle, { backgroundColor: Color.primary }]}>
                                             <Text style={[styles.insightCircleText, { color: Color.white }]}>{totalDonation}</Text>
                                        </View>
                                        <View style={styles.insightsTextontainer}>
                                             <Text style={[styles.insightHeading, { color: Color.primary, letterSpacing: 1 }]}>Total Donations</Text>
                                        </View>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={[styles.insightsCard, { backgroundColor: "#CBEACD", borderWidth: 2, borderColor: "#009C1A" }]} onPress={() => navigation.navigate('AdminDonationsList', { type: 'APPROVED' })}>
                                        <View style={[styles.insightCircle, { backgroundColor: "#009C1A" }]}>
                                             <Text style={[styles.insightCircleText, { color: Color.white }]}>{donations1?.approved}</Text>
                                        </View>
                                        <View style={styles.insightsTextontainer}>
                                             <Text style={[styles.insightHeading, { color: "#009C1A", letterSpacing: 1 }]}> Approved Donations</Text>
                                        </View>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={[styles.insightsCard, { backgroundColor: "#F5DDC5", borderWidth: 2, borderColor: "#F57A00" }]} onPress={() => navigation.navigate('AdminDonationsList', { type: 'PENDING' })}>
                                        <View style={[styles.insightCircle, { backgroundColor: "#F57A00" }]}>
                                             <Text style={[styles.insightCircleText, { color: Color.white }]}>{donations1?.pending}</Text>
                                        </View>
                                        <View style={styles.insightsTextontainer}>
                                             <Text style={[styles.insightHeading, { color: "#F57A00", letterSpacing: 1 }]}>Pending Donations</Text>
                                        </View>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={[styles.insightsCard, { backgroundColor: "#BAC2FF", borderWidth: 2, borderColor: "#00059F" }]} onPress={() => navigation.navigate('AdminDonationsList', { type: 'RECEIVED' })}>
                                        <View style={[styles.insightCircle, { backgroundColor: "#00059F" }]}>
                                             <Text style={[styles.insightCircleText, { color: Color.white }]}>{donations1?.received}</Text>
                                        </View>
                                        <View style={styles.insightsTextontainer}>
                                             <Text style={[styles.insightHeading, { color: "#00059F", letterSpacing: 1 }]}>Received Donations</Text>
                                        </View>
                                   </TouchableOpacity>
                              </View>
                         </ScrollView>
                    </>
               }

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
          height: 500,
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
     bottomContainer: {
          marginTop: '5%',
     },
     cardConatiner: {
          // marginTop: '5%',
          marginBottom: '20%',
          height: '100%'
     },
     cardHeaderText: {
          color: Color.textPrimary,
          fontSize: 15,
     },
     card: {
          // borderColor: Color.borderColor,
          backgroundColor: Color.secondary,
          borderRadius: 10,
          width: '100%',
          // minHeight: 94,
          // maxHeight: 130,
          marginBottom: '5%'
     },
     cardHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1,
          paddingHorizontal: '3%',
          paddingVertical: '2%',
          borderRadius: 10,


     },
     cardMainContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: '2%',
          paddingHorizontal: '5%'
     },
     cardFooterContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: '5%',
          paddingBottom: '5%',
          borderRadius: 10,
     },
     type: {
          fontSize: 18,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 1,
          paddingHorizontal: '5%',
          paddingVertical: '2%',
          borderRadius: 10,
          backgroundColor: Color.primary,
          color: Color.white
     },
     status: {
          fontSize: 18,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 1,
          paddingHorizontal: '5%',
          paddingVertical: '2%',
          borderRadius: 10,
     },
     iconContainer: {
          width: '20%',
          // justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
     },
     icon: {
          color: Color.primary,
          fontSize: 20,
          fontWeight: '800'
     },
     logoimage: {
          borderColor: Color.borderColor,
          borderRadius: 60,
          width: '100%',
          height: 60,
          width: 60,
     },

     cardTextContainer: {
          width: '85%',
     },
     heading: {
          marginTop: '10%',
          color: Color.textPrimary,
          fontSize: 20,
          textAlign: 'center',
          letterSpacing: 2
     },
     subHeading: {
          color: Color.textGray,
          fontWeight: '400',
          fontSize: 20,
          textAlign: 'center'
     },
     cardText: {
          color: Color.textPrimary,
          fontSize: 18,
          fontWeight: '600',
          // textShadowColor: 'rgba(0, 0, 0, 0.2)',
          // textShadowRadius: 10,

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
     insightsContainer: {
          height: '100%',
          backgroundColor: Color.white,
          marginTop: '7%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingVertical: '7%',
          paddingHorizontal: '5%',
          gap: 15
     },
     insightsCard: {
          height: 110,
          borderRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
          padding: '5%',
          gap: 20
     },
     insightCircle: {
          borderRadius: 300,
          // padding: '8%',
          width: 85,
          height: 85,
          justifyContent: 'center',
          alignItems: 'center'
     },
     insightCircleText: {
          fontSize: 20,
          color: Color.primary,
          fontWeight: '800'
     },
     insightHeading: {
          fontSize: 20,
          color: Color.white,
          fontWeight: '600',
     },
     insightsTextontainer: {
          width: '100%',
          flexWrap: 'wrap'
     }
});

export default Home;
