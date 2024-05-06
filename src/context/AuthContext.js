import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export const AuthContext = React.createContext();


export const AuthProvider = ({ children }) => {
  const [coords, setCoords] = useState({}) ;
  const [activeUser, setActiveUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, user => {
      if (user) {
        console.log("user already Signed in", user);
        setActiveUser(user);
      }
    });
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider value={{ coords, setCoords,  activeUser, setActiveUser, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};