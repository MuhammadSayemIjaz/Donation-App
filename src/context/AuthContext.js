import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { signOut } from '@firebase/auth';
import Toast from "react-native-toast-message";
// import { useNavigation } from '@react-navigation/native';
export const AuthContext = React.createContext();


export const AuthProvider = ({ children }) => {
  const [coords, setCoords] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState();
  // const navigation = useNavigation();
  const handleToast = (type, text1, text2) => {
    Toast.show({
         type: type,
         text1: text1,
         text2: text2,
         topOffset: 50,
    });
}
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, user => {
      if (user) {
        console.log("user already Signed in", user);
        setActiveUser(user);
        // navigation.navigate('TABS');
      }
    });
    return subscriber;
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then((res) => {
        handleToast("success", "Logout", "Logged Out Successfully")
        setActiveUser({})
      }).catch((err) => {
        handleToast("error", "Error Message", err)
      })
  };

  return (
    <AuthContext.Provider value={{ coords, setCoords, activeUser, setActiveUser, role, setRole, userData, setUserData, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};