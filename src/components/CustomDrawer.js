import React, { useContext } from 'react';
import {
     View,
     Text,
     TouchableOpacity,
     StyleSheet,
     Image
} from 'react-native';
import {
     DrawerContentScrollView,
     DrawerItemList,
} from '@react-navigation/drawer';
import { Button } from 'react-native-paper';
import Toast from "react-native-toast-message";
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Color } from '../../GlobalStyles';

import { useNavigation } from '@react-navigation/core';
import { isEmpty } from 'lodash';
import { StatusBar } from 'expo-status-bar';

const CustomDrawer = (props) => {
     const { activeUser, setActiveUser, handleSignOut } = useContext(AuthContext);
     const navigation = useNavigation();
     const handleToast = (type, text1, text2) => {
          Toast.show({
               type: type,
               text1: text1,
               text2: text2,
               topOffset: 50,
          });
     }
     const handleSignOut1 = async () => {
          handleSignOut()
     }
     return (
          <View style={{ flex: 1, backgroundColor: Color.white }}>
               <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={{}}>
                    <View style={styles.header}>
                         <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                              {!isEmpty(activeUser) ?
                                   <View style={styles.imageContainer}>
                                        <Image style={[styles.imageContainer, styles.image]} resizeMode="cover" source={{ uri: activeUser?.photoURL }} />
                                   </View>
                                   :
                                   <FontAwesome name="user-circle-o" size={70} color={Color.containerColor} />
                              }
                              {activeUser ? <View>
                                   <Text style={{ fontWeight: '600', fontSize: 25, marginLeft: 10, color: Color.textPrimary }}> {activeUser?.displayName}</Text>
                                   <Text style={{ fontSize: 12, marginLeft: 10, color: Color.textPrimary }}> {activeUser?.email}</Text>
                              </View> : <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('Login')}>
                                   <Button
                                        mode="contained"
                                        style={{
                                             backgroundColor: Color.containerColor,
                                             marginLeft: 20,
                                             width: 150
                                        }}
                                        labelStyle={{

                                             color: Color.backgroundColorPrimary,
                                             paddingVertical: 10,
                                        }} icon={'login'}> Login </Button>
                              </TouchableOpacity>
                              }
                         </View>
                    </View>
                    <View style={{ flex: 1, paddingTop: 20 }}>
                         <DrawerItemList {...props} />
                    </View>
               </DrawerContentScrollView>
               <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: Color.containerColor, }}>
                    <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 10 }}>
                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Octicons name="share-android" size={24} color={Color.containerColor} />
                              <Text
                                   style={{
                                        fontSize: 15,
                                        marginLeft: 10,
                                        color: Color.containerColor
                                   }}>
                                   Tell a Friend
                              </Text>
                         </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSignOut1} style={{ paddingVertical: 15 }}>
                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <FontAwesome name="sign-out" size={24} color={Color.primary} />
                              <Text
                                   style={{
                                        fontSize: 18,
                                        marginLeft: 10,
                                        color: Color.primary,
                                        fontWeight: '600',
                                        letterSpacing: 1
                                   }}>
                                   Sign Out
                              </Text>
                         </View>
                    </TouchableOpacity>
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     header: {
          height: 110,
          width: '100%',
          borderBottomWidth: 1,
          borderBottomColor: Color.secondary,
     },
     imageContainer: {
          width: 70,
          height: 70,
          borderRadius: 60,
          backgroundColor: 'white',
     },
     image: {
          borderWidth: 3,
          borderColor: Color.primary,
     }
})
export default CustomDrawer;
