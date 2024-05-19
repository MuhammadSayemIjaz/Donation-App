import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
// import { useNavigation } from '@react-navigation/native';
export const AuthContext = React.createContext();


export const AuthProvider = ({ children, navigate }) => {
  const [coords, setCoords] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState();
  // const navigation = useNavigation();
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

  return (
    <AuthContext.Provider value={{ coords, setCoords, activeUser, setActiveUser, role, setRole, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};