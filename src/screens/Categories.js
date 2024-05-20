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


const Categories = ({ navigation }) => {
     const { activeUser, role } = useContext(AuthContext)
     const [isLoading, setIsLoading] = useState(false);
     const [donation, setDonation] = useState([]);
     const [state, setState] = useState({});
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
          setDonation([...donations]);
          setIsLoading(false)
     };

     useEffect(() => {
          readDocs()
     }, [])
     return (
          <SafeAreaView style={styles.container}>
               <StatusBar backgroundColor='transparent' translucent={false} style='dark' />
               <View style={styles.subContainer}>
                    <View style={styles.headerContainer}>
                         <TouchableOpacity onPress={() => navigation.goBack()}>
                              <Ionicons name="arrow-back" size={26} color={Color.textPrimary} />
                         </TouchableOpacity>
                         <Text style={styles.heading}>Categories</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        { role !== 'receiver' && <View style={styles.content}>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BloodDonation')}>
                                   <View style={styles.cardContent} >
                                        <Fontisto name="blood-drop" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Blood Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DonationForm')}>
                                   <View style={styles.cardContent}>
                                        <Ionicons name="fast-food-sharp" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Food Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DonationForm')}>
                                   <View style={styles.cardContent}>
                                        <Ionicons name="shirt" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Cloth Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DonationForm')}>
                                   <View style={styles.cardContent}>
                                        <MaterialCommunityIcons name="pill" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Medicine Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MoneyDonation')}>
                                   <View style={styles.cardContent}>
                                        <FontAwesome5 name="money-bill-wave" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Money Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DonationForm')}>
                                   <View style={styles.cardContent} >
                                        <FontAwesome5 name="hand-holding-heart" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Others</Text>
                                   </View>
                              </TouchableOpacity>
                         </View>}
                        { role == 'receiver' && <View style={styles.content}>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReceiverSearchList', {type : 'blood'})}>
                                   <View style={styles.cardContent} >
                                        <Fontisto name="blood-drop" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Blood Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReceiverSearchList', {type : 'food'})}>
                                   <View style={styles.cardContent}>
                                        <Ionicons name="fast-food-sharp" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Food Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReceiverSearchList', {type : 'cloths'})}>
                                   <View style={styles.cardContent}>
                                        <Ionicons name="shirt" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Cloth Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReceiverSearchList', {type : 'medicine'})}>
                                   <View style={styles.cardContent}>
                                        <MaterialCommunityIcons name="pill" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Medicine Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReceiverSearchList', {type : 'charity'})}>
                                   <View style={styles.cardContent}>
                                        <FontAwesome5 name="money-bill-wave" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Money Donation</Text>
                                   </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReceiverSearchList', {type : 'others'})}>
                                   <View style={styles.cardContent} >
                                        <FontAwesome5 name="hand-holding-heart" size={44} color={Color.primary} />
                                        <Text style={styles.cardText}>Others</Text>
                                   </View>
                              </TouchableOpacity>
                         </View>}
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
          marginTop: '15%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 15,
          paddingTop: '10%'

     },
     card: {
          borderColor: Color.primary,
          borderRadius: 10,
          padding: '5%',
          marginBottom: '5%',
          width: '40%',
          height: 150,
          borderWidth: 1,
     },
     cardContent: {
          // flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 20
     },
     cardText: {
          fontSize: 18,
          color: Color.textPrimary,
          marginLeft: '5%',
          textAlign: 'center',
          fontWeight: '600',
          letterSpacing: 1

     }


});

export default Categories;
