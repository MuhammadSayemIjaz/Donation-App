import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import CustomTextInput from '../../components/CustomTextInput';
import CustomeIconButton from '../../components/CustomeIconButton';
import { Color } from '../../../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const handleToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      topOffset: 50,
    });
  }

  const [state, setState] = useState({
    email: '',
  });

  const [error, setError] = useState({
    email: '',
  });

  const validateForm = () => {
    let errors = {};
    if (!state.email) {
      errors.email = true;
      handleToast('error', 'Email', 'Email is required')
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      errors.email = true;
      handleToast('error', 'Email', 'Invalid email format')
    }
    setError(errors)
    return Object.keys(errors).length === 0;
  };
  const handleInputChange = (fieldName, value) => {
    setState({ ...state, [fieldName]: value });
  };
  const handleSubmit = () => {
    setIsLoading(true)
    const { email } = state;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        handleToast("success", "Password Reset Email", `Email sent on ${email}`)
        setIsLoading(false)
        navigation.navigate('CheckEmail', {email : email})
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
              <Image style={styles.image} source={require('../../../assets/images/forgotPassword.png')} resizeMode='contain' />
            </View>
          </View>
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.subHeading}>Please provide your email. We'll Send you password reset Email</Text>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                label="Email"
                placeholder="Enter Email"
                left={
                  <TextInput.Icon iconColor={Color.primary} icon="email" size={30} />
                }
                value={state.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={!!error.email && true}
              />
            </View>
            <View style={styles.btnContainer}>
              <CustomeIconButton
                isLoading={isLoading}
                title="Reset Password"
                leftIcon={<MaterialCommunityIcons name="email-send" size={24} color={Color.white} />}
                titleStyle={{ color: Color.white }}
                style={styles.btn}
                onPress={() => {
                  if (validateForm()) {
                    handleSubmit();
                  }
                }}
              />
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={{ marginTop: '20%', flexDirection: 'row', alignItems: 'center' }}>
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
    backgroundColor: Color.primary,
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
    backgroundColor: Color.white
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
    marginTop: '5%',
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
    marginTop: 5,
    gap: 10,
  },
  btn: {
    backgroundColor: Color.primary,
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

export default ForgotPassword;
