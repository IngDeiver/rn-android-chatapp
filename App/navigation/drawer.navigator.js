import React, { useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createSelector } from '@reduxjs/toolkit';
import { ContentDrawer } from '../components';
import { Login } from '../screens';
import { useSelector } from 'react-redux';
import Stack from './stack.navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


const Drawer = createDrawerNavigator();

const authSelecetor = () =>
  createSelector(
    state => state.auth,
    auth => auth,
);

const getStackFocusScren = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Chats';

  switch (routeName) {
    case 'Chats':
      return true;
    case 'Chat':
      return false
  }

}

const DrawerNavigator = () => {
  const authSelectorMemorized = useMemo(authSelecetor, []);
  const auth = useSelector(authSelectorMemorized);

  return (
    <Drawer.Navigator
      drawerContent={props => <ContentDrawer {...props} />}
      drawerContentOptions={{
        activeBackgroundColor: '#6c5ce7',
        activeTintColor: '#fff',
      }}>
      {auth.name ? (
        <>
          <Drawer.Screen
          name="Users" 
          options={({route}) => ({
              drawerIcon: ({ color, size }) => (
                <Icon name="wechat" size={size} color={color} />
              ),
              swipeEnabled: getStackFocusScren(route)
          })} component={Stack} />
        </>
      ) : (
        <Drawer.Screen
          options={{
            headerShown: false,
            swipeEnabled: false
          }}
          name="Login"
          component={Login}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
