import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput, Searchbar, ActivityIndicator } from 'react-native-paper';
import { Color } from '../../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import { firestoreDB } from '../config/firebase';
import { collection, doc, getDocs, query, where } from "firebase/firestore/lite";
import { Entypo } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { isEmpty } from 'lodash';

const DonationsSearchList = () => {
     const navigation = useNavigation();
     const { activeUser, role } = useContext(AuthContext);
     const [isLoading, setIsLoading] = useState(false);
     const [donations, setDonations] = useState([1]);
     const [copyDonations, setCopyDonations] = useState([])
     const [searchQuery, setSearchQuery] = React.useState('');
     const handleToast = (type, text1, text2) => {
          Toast.show({
               type: type,
               text1: text1,
               text2: text2,
               topOffset: 50,
          });
     }
     const collectionName = "Donations";
     const collectionRef = collection(firestoreDB, collectionName);
     const querry = role?.toLowerCase() == 'donor' ? 
                    query(collectionRef, where("uid", "==", activeUser.uid)) 
                    : 
                    role.toLowerCase() == 'receiver' ? 
                    query(collectionRef, where("status", "==", "APPROVED"))  :
                    collectionRef;
     const readDocs = async () => {
          setIsLoading(true)
          let donations = [];
          let commercailAmbulances = []
          
          const querySnapshot = await getDocs(querry);
          querySnapshot.forEach((doc) => {
               donations.push(doc.data());
          });

          setDonations([...donations]);
          setCopyDonations([...donations]);
          console.log(donations);
          setIsLoading(false)
     };
     useEffect(() => {
          readDocs()
     }, [])
     const onChangeSearch = (query) => {
          console.log(query);
          const filteredAmbulances = copyDonations.filter((donation) => {
               const name = donation?.data?.toLowerCase();
               const number = donation?.title?.toLowerCase();
               const description = donation?.desc?.toLowerCase();
               return name?.includes(query?.toLowerCase()) || number?.includes(query?.toLowerCase()) || description?.includes(query?.toLowerCase());
          });
          setDonations(filteredAmbulances)
          setSearchQuery(query)
          // isEmpty(query) && setDonations(copyDonations)
     }


     return (
          <SafeAreaView style={styles.container}>
               <StatusBar backgroundColor='transparent' translucent={true} style='light' />
               <View style={styles.searchtext}>
                    <Searchbar
                         placeholder="Search Here..."
                         onChangeText={onChangeSearch}
                         value={searchQuery}
                         icon="magnify"
                         iconColor={Color.primary}
                         style={{
                              backgroundColor: Color.white,
                              fontSize: 40,
                              borderRadius: 10,
                         }}
                    />
               </View>
               <View style={styles.header}>
                    <View style={styles.cardConatiner}>
                         <ScrollView showsVerticalScrollIndicator={false}>
                              {isLoading ?
                                   (<View style={styles.loadingContainer}>
                                        <ActivityIndicator animating={true} size="large" color={Color.primary} />
                                   </View>) :
                                   (isEmpty(donations) ?
                                        <View style={styles.imageContainer}>
                                             <Image style={styles.emptyImage} source={require('../../assets/images/EmptyList.png')} />
                                             <Text style={styles.heading}>Empty List</Text>
                                        </View> :
                                        donations.map((donation) => (
                                             <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('DonationDetails', { item: donation })}>
                                                  <View style={[styles.card,
                                                  donation?.status === 'PENDING' && { backgroundColor: 'orange' } ||
                                                  donation?.status === 'APPROVED' && { backgroundColor: 'green' } ||
                                                  donation?.status === 'REJECTED' && { backgroundColor: 'red' } ||
                                                  donation?.status === 'COMPLETED' && { backgroundColor: 'blue' }
                                                  ]} key={donation.uid}>
                                                       {/* <View style={styles.iconContainer}>
                                                            <View style={styles.logoimage}>
                                                                 <Image style={styles.logoimage} resizeMode="contain" source={{ uri: donation?.donorImage }} />
                                                            </View>
                                                       </View> */}
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
                                             </TouchableOpacity>
                                        ))
                                   )}
                         </ScrollView>
                    </View>
               </View>
          </SafeAreaView>
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
          marginTop: '20%'
     },
     cardConatiner: {
          marginTop: '5%',
          marginBottom: '20%',
          height: '100%'
     },
     card: {
          // borderColor: Color.borderColor,
          backgroundColor: Color.secondary,
          borderRadius: 20,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 94,
          maxHeight: 130,
          padding: '7%',
          marginBottom: '5%'
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
     header: {
          marginTop: '10%',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 25,
          padding: '7%',
          backgroundColor: Color.white
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
     imageContainer: {
          height: 500,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
     },
     image: {
          width: '100%',
          height: '100%',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
     },
     loadingContainer: {
          height: 550,
          justifyContent: 'center',
          alignItems: 'center'
     },
     cardSubHeading: {
          fontSize: 15,
          //    letterSpacing: 2,
          overflow: 'hidden',
          marginTop: '5%'
          // textOverflow: 'ellipsis',
     },
     emptyImage: {
          width: '100%',
          height: 150,
     }
});

export default DonationsSearchList;