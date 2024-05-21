import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import { Color } from '../../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import { firestoreDB } from '../config/firebase';
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { isEmpty } from 'lodash';
import { getFormatedDate, getFormatedTime } from '../utils/functions';

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
          role?.toLowerCase() == 'receiver' ?
               query(collectionRef, where("status", "==", "APPROVED")) :
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
               const status = donation?.status?.toLowerCase();
               const type = donation?.type?.toLowerCase();
               return name?.includes(query?.toLowerCase()) || number?.includes(query?.toLowerCase()) || description?.includes(query?.toLowerCase()) || status?.includes(query?.toLowerCase()) || type?.includes(query?.toLowerCase())  ;
          });
          setDonations(filteredAmbulances)
          setSearchQuery(query)
          console.log(donations);
          // isEmpty(query) && setDonations(copyDonations)
     }


     return (
          <SafeAreaView style={styles.container}>
               <StatusBar backgroundColor='transparent' translucent={true} style='light' />
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <Ionicons name="arrow-back" size={26} color={Color.white} />
                    </TouchableOpacity>
                    <Text style={styles.heading1}>Donations List</Text>
               </View>
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
          paddingHorizontal: '5%',
          alignItems: 'center',
          justifyContent: 'center',
     },
     cardConatiner: {
          // marginTop: '5%',
          // marginBottom: '60%',
          paddingBottom: 150,
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
          paddingTop: '3%',
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
     header: {
          marginTop: '10%',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 25,
          padding: '5%',
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
     },
     headerContainer: {
          marginTop: '10%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: '5%',
          paddingBottom: '5%',
     },
     heading1: {
          fontSize: 25,
          color: Color.white,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontWeight: '600',
          letterSpacing: 1
     },
});

export default DonationsSearchList;
