import * as React from 'react';
import { StyleSheet,Button, Text, View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import Deliveries_main from './Abort/Deliveries_main';
const Stack = createStackNavigator();
export default function DeliveriesScreen() {

   
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Deliveries main"
        component={Deliveries_main}
        options={{ headerShown: false }}
      />
    
    </Stack.Navigator>
    
  );
}