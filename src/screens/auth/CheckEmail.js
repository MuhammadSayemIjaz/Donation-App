import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image, Linking } from 'react-native';
import CustomeIconButton from '../../components/CustomeIconButton';
import { Color } from '../../../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const CheckEmail = ({route}) => {
  const { email } = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(email);
  const handleToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      topOffset: 50,
    });
  }
  const handleOpenGmail = () => {
    const emailUrl = `mailto:${email}`; // replace with your email address
    Linking.openURL(emailUrl);
  }
  const handleSubmit = () => {
    setIsLoading(true)
    sendPasswordResetEmail(auth, email)
      .then(() => {
        handleToast("success", "Resend Email", `Email resent on ${email}`)
        setIsLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        handleToast("error", errorCode, errorMessage)
        setIsLoading(false)

      });
    setIsLoading(false)
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='transparent' translucent={true} style='light' />
      <View style={styles.header}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <View style={styles.image}>
              <Image style={styles.image} source={require('../../../assets/images/CheckEmail.png')} resizeMode='contain' />
            </View>
          </View>
          <Text style={styles.heading}>Check your email</Text>
          <Text style={styles.subHeading}>We sent a password reset link to <Text style={{fontSize: 14, fontWeight: '600'}}>{userEmail}</Text> </Text>
          <View style={styles.content}>
              <View style={{ marginTop: '10%', alignItems: 'center', width: '100%' }}>
                <Text style={[styles.subHeading, {fontSize: 18}]}>
                Didn't receive the email?</Text>
          <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.subHeading, ]}>
                Press to resend email</Text>
            </TouchableOpacity>
              </View>
          <View style={styles.btnContainer}>
              <CustomeIconButton
                isLoading={isLoading}
                title="Open Email App"
                leftIcon={<MaterialIcons name="email" size={24} color={Color.containerColor} />}
                titleStyle={{ color: Color.containerColor }}
                style={styles.btn}
                onPress={handleOpenGmail}
              />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('FirstLogin')}>
              <View style={{ marginTop: '10%', flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="arrow-back" size={22} style={{marginRight: 10}} color={Color.heading2} />
                <Text style={[styles.subHeading]}>
                  Back to Login Page ?</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColorPrimary,
  },
  inputConatiner: {
    padding: '5%'
  },
  header: {
    marginTop: '20%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    height: '100%',
    padding: '7%',
    backgroundColor: Color.containerColor
  },
  heading: {
    marginTop: '10%',
    color: Color.heading1,
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center'
  },
  subHeading: {
    color: Color.heading2,
    fontWeight: '400',
    fontSize: 18,
    textAlign: 'center'
  },
  content: {
    width: '100%',
    alignItems: 'center',
    marginTop: '0%',
    paddingBottom: 60,
  },
  inputContainer: {
    width: '100%',
    marginTop: '8%',
    marginBottom: '5%',
    gap: 15,
  },
  btnContainer: {
    width: '100%',
    marginTop: '15%',
    gap: 10,
  },
  btn: {
    backgroundColor: Color.backgroundColorPrimary,
  },
  imageContainer: {
    height: 270,
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
});

export default CheckEmail;
