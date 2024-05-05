import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import CustomTextInput from '../../components/CustomTextInput';
import { StatusBar } from 'expo-status-bar';
import { Color } from '../../../GlobalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import CustomeIconButton from '../../components/CustomeIconButton';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import { AuthContext } from '../../context/AuthContext';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebase';

const Login = () => {
  const { activeUser, setActiveUser, setRole } = useContext(AuthContext);
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
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
    password: '',
  });

  const [error, setError] = useState({
    email: '',
    password: '',
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
    const { email , password } = state;
    if (!activeUser) {
      signInWithEmailAndPassword(auth, email.toLowerCase(), password)
        .then((userCredential) => {
          const user = userCredential.user;
          handleToast("success", "Login User", "User Login Successfully")
          // setRole("Receiver")
          setActiveUser(user)
          setIsLoading(false)
          console.log(userCredential.user);
          // navigation.navigate('DrawerNavigation')
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setIsLoading(false)
          handleToast("error", errorCode, errorMessage)
        });
    } else {
      setIsLoading(false);
     //  navigation.navigate('DrawerNavigation', activeUser);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='transparent' translucent={true} style='light' />
      <View style={styles.header}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <View style={styles.image}>
              <Image style={styles.image} source={require('../../../assets/images/Login.png')} resizeMode='contain' />
            </View>
          </View>
          <Text style={styles.heading}>Welcome back!</Text>
          <Text style={styles.subHeading}>Let's Sign in to explore the features </Text>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                label="Email"
                placeholder="Enter Email"
                left={
                  <TextInput.Icon style={{marginTop: 15}} iconColor={Color.primary} icon="email" size={30} />
                }
                value={state.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={!!error.email && true}
              />
              <CustomTextInput
                label="Password"
                placeholder="Enter Password"
                left={
                  <TextInput.Icon iconColor={Color.primary} style={{marginTop: 10}} icon="lock" size={30} />
                }
                right={
                  <TextInput.Icon style={{marginTop: 10}} onPress={() => setShowPassword(!showPassword)} iconColor={Color.primary} icon={showPassword ? "eye" : 'eye-off'} size={30} />
                }
                secureTextEntry={showPassword ? false : true}
                value={state.password}
                onChangeText={text => handleInputChange('password', text)}
              />
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} >
                <Text style={styles.forPassText}> Forgot Password ?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <CustomeIconButton
                isLoading={isLoading}
                title="Login"
                style={styles.btn}
                titleStyle={{ color: Color.textSecondary }}
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
    backgroundColor: Color.textSecondary,
  },
  inputConatiner: {
    padding: '5%'
  },
  header: {
//     marginTop: '20%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    height: '100%',
    padding: '7%',
    backgroundColor: Color.containerColor
  },
  heading: {
    color: Color.heading1,
//     fontWeight: 600,
    fontSize: 25,
  },
  subHeading: {
    color: Color.heading2,
    fontSize: 20,
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
    gap: 10,
  },
  btnContainer: {
    width: '100%',
    marginBottom: 10,
    marginTop: '3%',
  },
  btn: {
    backgroundColor: Color.primary,
  },
  prevBtn: {
    backgroundColor: Color.containerColor,
    color: Color.heading1,
    borderWidth: 1,
  },
  contacttext: {
    width: '100%',
    alignItems: 'center',
    marginTop: '5%',
    paddingBottom: 60,

  },
  imageContainer: {
//     height: 190,
//     width: '100%',
     paddingTop: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
     width: 250,
     height: 'auto',
     aspectRatio: 1,
     objectFit: 'contain',
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
  },
  dividerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '7%'
  },
  dividerText: {
    color: Color.secondaryText,
  },
  footer: {
    width: '100%',
    marginTop: '19%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    color: Color.heading1,
    fontSize: 27,
//     fontWeight: 600,
  },
  forPassText: {
    color: Color.textPrimary,
    fontSize: 15,
//     fontWeight: 600,
    textAlign: 'right',
    marginTop: '4%'
  },
});

export default Login;
