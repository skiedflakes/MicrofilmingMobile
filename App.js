import React, { useState, useEffect,Alert} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screen/HomeScreen';
import LoginScreen from './src/screen/LoginScreen';


import DeliveriesScreen from './src/screen/DeliveriesScreen';
import TestScreen from './src/screen/TestScreen';
const Stack = createStackNavigator(); 

function App() {
    useEffect(() => {
      // global.global_url = 'https://mobile.wdysolutions.com/notes_verifier/main/';
      //global.global_url = 'http://192.168.254.185/PigNotesMobile/';
      // global.global_url = 'http://192.168.8.106/PigNotesMobile_php/';

      //mylocalhost
      //  global.global_url = 'http://192.168.41.1/microfilming_localhost/';
      //  global.notes_web_directory = 'http://192.168.41.1/notes/';

      //dev url
      global.global_url = 'https://mobile.wdysolutions.com/microfilming/main/';
      global.notes_web_directory = 'https://dev.wdysolutions.com/wfh';
    });
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {/* main */}
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}  />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>

            <Stack.Screen name="Deliveries" component={DeliveriesScreen}
             options={{ headerShown: false }}/>
            <Stack.Screen name="Test Screen" component={TestScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    )
}
export default App;