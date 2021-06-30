import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'

const HeaderLefTemplate = () => {
  const location = useNavigation()

  const toggleDrawer = () => {
    location.toggleDrawer();
  }

  return (
    <TouchableOpacity style={{ marginLeft: 20, padding: 5 }} onPress={toggleDrawer}>
      <Icon size={24} name="bars" color="white"/>
    </TouchableOpacity>
  );
};

export default HeaderLefTemplate;
