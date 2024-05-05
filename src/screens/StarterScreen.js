import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Color } from '../../GlobalStyles';
const StarterScreen = () => {
     const navigation = useNavigation();
     return (
          <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('StarterScreen1')}>
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
          color: Color.secondary
     }
})