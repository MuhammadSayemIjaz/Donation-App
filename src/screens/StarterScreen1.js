import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Color } from '../../GlobalStyles';
import DonationImage from '../../assets/images/donation.svg';
import CustomeButton from '../components/CustomeButton';
import CustomeIconButton from '../components/CustomeIconButton';
import { StatusBar } from 'expo-status-bar';

const StarterScreen1 = () => {
     const navigation = useNavigation();
     return (
          <View style={styles.container} >
               <StatusBar backgroundColor='transparent' translucent={true} style='dark' />
               <Image style={styles.image} source={require('../../assets/images/donation1.jpg')} />
               <Text style={styles.heading}>Need To Change Our Society</Text>
               <Text style={styles.paragraph}>Your generosity can change a life, donate now.</Text>
               <CustomeIconButton
                    isLoading={false}
                    title="Create an account"
                    style={styles.primaryBtn}
                    titleStyle={{ color: Color.textSecondary }}
                    onPress={() =>  navigation.navigate('Signup')}
               />
               <CustomeIconButton
                    isLoading={false}
                    title="Already have an account ?"
                    style={styles.secondaryBtn}
                    titleStyle={{ color: Color.textPrimary }}
                    onPress={() =>  navigation.navigate('Login')}
               />
          </View>
     )
}

export default StarterScreen1

const styles = StyleSheet.create({
     container: {
          flex: 1,
          // justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          paddingTop: '25%',
          paddingHorizontal: '5%',
          gap: 24
     },
     heading: {
          fontSize: 25,
          color: Color.primary,
          textAlign: 'left',
          width: '100%'
     },
     image: {
          borderWidth: 2,
          width: 350,
          height: 'auto',
          aspectRatio: 1,
     },
     paragraph: {
          fontSize: 18,
          color: Color.textPrimary,
          width: '100%'
     },
     primaryBtn: {
          marginTop: 20,
          backgroundColor: Color.primary,
     },
     secondaryBtn: {
          borderWidth: 1,
          borderColor: Color.primary
     }
})