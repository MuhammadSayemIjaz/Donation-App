import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Color } from '../../GlobalStyles';
import { AuthContext } from '../context/AuthContext';
const StarterScreen = () => {
     const navigation = useNavigation();
     // const {activeUser} = useContext(AuthContext);
     // if(activeUser) {
     //      navigation.navigate('TABS')
     // }
     return (
          <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('StarterScreen1')}>
               <View style={styles.imageContainer} >
                    <Image style={styles.image} source={require('../../assets/images/DonateNow.png')} />
               </View>
               <Text style={styles.heading}>Donate for Smile</Text>
          </TouchableOpacity>
     )
}

export default StarterScreen

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Color.primary

     },
     heading: {
          fontSize: 30,
          color: Color.secondary,
          fontWeight: 'bold',
          letterSpacing: 2,
     },
     imageContainer:{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
     },
     image: {
          width: 400,
          // height: 300,
          // aspectRatio: 1,
          objectFit: 'contain'
     }
})