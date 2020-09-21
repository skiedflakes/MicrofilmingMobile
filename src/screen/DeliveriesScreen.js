import * as React from 'react';
import { StyleSheet,Button, Text, View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import Deliveries_main from './Deliveries/Deliveries_main';
const Stack = createStackNavigator();
export default function DeliveriesScreen({route}) {
  //global params for instant loading
  const { company_id,branch_id,company_code } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Deliveries main"
        component={Deliveries_main}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code }}
      />
    
    </Stack.Navigator>
  );
}