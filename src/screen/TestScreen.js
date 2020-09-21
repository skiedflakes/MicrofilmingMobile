import * as React from 'react';
import { StyleSheet,Button, Text, View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import Test_main from './Test/Test_main';
const Stack = createStackNavigator();
export default function DeliveriesScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Test main"
        component={Test_main}
        options={{ headerShown: false }}
      />
    
    </Stack.Navigator>
  );
}