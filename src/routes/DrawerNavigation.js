/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '../../GlobalStyles';
import TABS from './TabNavigation';
const Drawer = createDrawerNavigator();
const userOptions = [
     {
          title: "User Home",
          icon: "home-sharp",
          outline_icon: 'home-outline',
          component: TABS,
     },
]

const DrawerNavigation = () => {
     const { activeUser, role } = useContext(AuthContext);
     return (
          <Drawer.Navigator
               drawerContent={props => <CustomDrawer {...props} />}
               screenOptions={{
                    headerShown: false,
                    drawerActiveBackgroundColor: Color.primary,
                    drawerActiveTintColor: Color.white,
                    drawerInactiveTintColor: Color.white,
                    drawerLabelStyle: {
                         marginLeft: -20,
                         fontSize: 15,
                    },
               }}>
               <Drawer.Group screenOptions={{ headerShown: false }}>

                    {userOptions?.map((option) => (
                         <Drawer.Screen
                              key={option?.title}
                              name={option?.title}
                              component={option?.component}
                              options={{
                                   drawerIcon: ({ focused, color }) => (
                                        <Ionicons name={focused ? option?.icon : option?.outline_icon} size={24} color={color} />
                                   ),
                              }}
                         />
                    ))}
               </Drawer.Group>
          </Drawer.Navigator>
     );
};

export default DrawerNavigation;
