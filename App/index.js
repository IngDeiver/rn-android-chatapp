import 'react-native-gesture-handler';

import React from 'react';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { Provider } from 'react-redux';
import store from './redux/store';

import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './navigation/drawer.navigator';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './redux/store';
import { ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen'
import messaging from '@react-native-firebase/messaging';

GoogleSignin.configure();

const App = () => {

  SplashScreen.hide()
  const unsubscribeOnMessage = messaging().onMessage(async _ => {
    console.log('A new FCM message arrived!');
  });


  React.useEffect(() => {
    return () => {
      unsubscribeOnMessage()
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={<ActivityIndicator animating={true} style={{ marginTop: 10 }} />}
        persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <DrawerNavigation />
            <Toast ref={ref => Toast.setRef(ref)} />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
