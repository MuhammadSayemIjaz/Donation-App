import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-paper'
import { Color } from '../../GlobalStyles'
const CustomTextInput = ({label, placeholder, style, ...others}) => {
  return (
    <TextInput
     mode='outlined'
     style={[styles.input, style]}
     label={<Text style={{fontSize: 20}}>{label}</Text>}
     placeholder={placeholder}
     outlineStyle={{borderRadius: 15,}}
     outlineColor={Color.textGray}
     activeOutlineColor={Color.primary}
     placeholderTextColor={Color.textGray}
     textColor={Color.textPrimary}
     {...others}
     autoComplete='off'
     />
  )
}

export default CustomTextInput

const styles = StyleSheet.create({
     input: {
          width: '100%',
          fontSize: 20,
          height: 60,
     },
})