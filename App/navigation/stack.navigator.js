import React, { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Chat } from '../screens';
import { HeaderLeft } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import messaging from '@react-native-firebase/messaging';
import { StackActions } from '@react-navigation/native';
import { SocketProvider } from '../context/socketContext';
import { io } from 'socket.io-client';
import { BASE_SERVER_URL } from '../services/api.service';
import { resetCounterUnreadMsg, updateCounterUnreadMsg } from '../redux/reducers/users.reducer'

const Stack = createStackNavigator();

const authSelecetor = () =>
  createSelector(
    state => state.auth,
    auth => auth,
  );

export default function StackNavigator({ navigation }) {
  const authSelectorMemorized = useMemo(authSelecetor, []);
  const auth = useSelector(authSelectorMemorized);
  const [socket, setSocket] = React.useState(null);
  const dispatch = useDispatch()

  const managamentNotification = (notification, replace = false) => {
    const data = notification.data;
    const screen = data.screen;

    if (screen === 'Chat') {
      dispatch(resetCounterUnreadMsg({ userId: data.toUser}))
      if (replace) {
        navigation.dispatch(
          StackActions.replace(screen, {
            name: data.nameUserToSend,
            to: data.toUser,
            tokenUserToSend: data.tokenUserToSend,
          }),
        );
      } else {
        navigation.navigate(screen, {
          name: data.nameUserToSend,
          to: data.toUser,
          tokenUserToSend: data.tokenUserToSend,
        });
      }
    }else{
      navigation.navigate(screen);
    }
  };

  React.useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      managamentNotification(remoteMessage, true);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          managamentNotification(remoteMessage);
        }
      });

    initializeSocket()

    return () => {
      if (socket) { socket.removeAllListeners() }
    }
  }, [auth, socket]);

  const initializeSocket = () => {
    if (auth.name && !socket) { // wait for a sesion 
      setSocket(
        io(BASE_SERVER_URL, {
          query: {
            userId: auth?._id,
          },
        })
      );
    } else { // wait for a socket instance
      socket.connect();

      socket.on('connect', () => {
        console.log('connected to socket server');
      });

      socket.on('new-message', (userId) => {
        dispatch(updateCounterUnreadMsg({
          userId
        }))
      })

    }
  }

  return (
    <SocketProvider value={socket}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#5f27cd',
          },
          headerTintColor: 'white',
        }}>
        <Stack.Screen
          name="Users"
          options={{
            headerLeft: () => <HeaderLeft />,
            headerTitleStyle: {
              fontSize: 15,
            },
            title: `Hello ${auth?.name.split(' ')[0]}`
          }}
          component={Home} // Home/Users
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
      </Stack.Navigator>
    </SocketProvider>
  );
}
