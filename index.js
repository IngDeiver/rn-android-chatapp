/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async _ => {
    console.log('Message handled in the background!');
  })
AppRegistry.registerComponent(appName, () => App);
