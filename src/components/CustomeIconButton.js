import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Color } from '../../GlobalStyles';


const CustomeIconButton = ({ onPress, rightIcon,leftIcon, title, style, titleStyle, isLoading, indicatorColor }) => {
     return (
          <TouchableOpacity activeOpacity={0.7} style={{width : '100%'}} onPress={onPress} >
               <View style={[styles.button, style]}>
                    {isLoading && <ActivityIndicator animating={true} color={Color.textSecondary} />}
                    {leftIcon}
                    <Text style={[styles.title, titleStyle]}>{title}</Text>
                    {rightIcon}
               </View>
          </TouchableOpacity >
     );
};

const styles = StyleSheet.create({
     button: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 20,
          borderRadius: 15,
          gap: 10,
          color: Color.primary,
     },
     title: {
          fontSize: 20,
          fontWeight: 600,
     },
});

export default CustomeIconButton;