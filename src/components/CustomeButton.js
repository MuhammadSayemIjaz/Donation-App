/* eslint-disable prettier/prettier */
import {StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

const CustomeButton = ({
  title,
  onPress,
  style,
  titleColor,
  isloading,
  ...others
}) => {
  const styles = StyleSheet.create({
    button: {
      borderRadius: 20,
      paddingVertical: 10,
      width: '100%',
      fontWeight: 600,
      fontSize: 33,
    },
  });
  return (
    <Button
      mode="contained"
      textColor={titleColor}
      // disabled={isloading}
      icon={isloading && "refresh"}
      loading={isloading}
      {...others}
      style={[style, styles.button]}
      onPress={onPress}>
      {title}
    </Button>
  );
};

export default CustomeButton;
