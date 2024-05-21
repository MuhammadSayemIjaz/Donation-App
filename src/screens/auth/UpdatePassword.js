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

const UpdatePassword = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

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
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    let errors = {};
    if (!state.email) {
      errors.email = true;
      handleToast('error', 'Email', 'Email is required')
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      errors.email = true;
      handleToast('error', 'Email', 'Invalid email format')
    } else if (!state.password) {
      errors.password = true;
      handleToast('error', 'Password', 'Password is required')
    } else if (state.password.length < 6) {
      errors.password = true;
      handleToast('error', 'Password', 'Password must be at least 6 characters long')
    } else if (!state.confirmPassword) {
      errors.confirmPassword = true;
      handleToast('error', 'Confirm password', 'Confirm password is required')
    } else if (state.password !== state.confirmPassword) {
      errors.confirmPassword = true;
      handleToast('error', 'Confirm password', 'Passwords do not match')
    }
    setError(errors)
    return Object.keys(errors).length === 0;
  };
  const handleInputChange = (fieldName, value) => {
    setState({ ...state, [fieldName]: value });
  };
  const handleSubmit = () => {
    console.log(state);
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
          <Text style={styles.heading}>Create New Password</Text>
          <Text style={styles.subHeading}>You new password must be different
            from previous password</Text>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
            <CustomTextInput
                label="Email"
                placeholder="Enter Email"
                left={
                  <TextInput.Icon iconColor={Color.backgroundColorPrimary} icon="email" size={30} />
                }
                value={state.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={!!error.email && true}
              />
              <CustomTextInput
                label="Password"
                placeholder="Enter Password"
                left={
                  <TextInput.Icon iconColor={Color.backgroundColorPrimary} icon="lock" size={30} />
                }
                right={
                  <TextInput.Icon onPress={() => setShowPassword(!showPassword)} iconColor={Color.backgroundColorPrimary} icon={showPassword ? "eye" : 'eye-off'} size={30} />
                }
                secureTextEntry={showPassword ? false : true}
                value={state.password}
                onChangeText={text => handleInputChange('password', text)}
                error={!!error.password && true}
              />
              <CustomTextInput
                label="Confirm Password"
                placeholder="Enter Password"
                left={
                  <TextInput.Icon iconColor={Color.backgroundColorPrimary} icon="lock" size={30} />
                }
                right={
                  <TextInput.Icon onPress={() => setConfirmShowPassword(!confirmShowPassword)} iconColor={Color.backgroundColorPrimary} icon={confirmShowPassword ? "eye" : 'eye-off'} size={30} />
                }
                secureTextEntry={confirmShowPassword ? false : true}
                value={state.confirmPassword}
                onChangeText={text => handleInputChange('confirmPassword', text)}
                error={!!error.confirmPassword && true}
              />

            </View>
            <View style={styles.btnContainer}>
              <CustomeIconButton
                title="Reset Password"
                titleStyle={{ color: Color.containerColor }}
                style={styles.btn}
                onPress={() => {
                  if (validateForm()) {
                    handleSubmit();
                  }
                }}
              />
            </View>
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
    marginTop: '5%',
    color: Color.heading1,
    fontWeight: '600',
    fontSize: 20,
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
    marginTop: 15,
    gap: 10,
  },
  btn: {
    backgroundColor: Color.backgroundColorPrimary,
  },
  prevBtn: {
    backgroundColor: Color.containerColor,
    color: Color.heading1,
  },
  contacttext: {
    width: '100%',
    alignItems: 'center',
    marginTop: '5%',
    paddingBottom: 60,

  },
  imageContainer: {
    height: 190,
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

export default UpdatePassword;
