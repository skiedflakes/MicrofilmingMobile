import * as React from 'react';
import {StyleSheet, Button, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import Receiving_main from './Receiving/Receiving_main';
import Upload_Receiving from './Receiving/Upload_Receiving';

const Stack = createStackNavigator();
export default function DeliveriesScreen({route}) {
  //global params for instant loading
  const {
    company_id,
    branch_id,
    company_code,
    user_id,
    allow_delete_mf,
  } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Recieving main"
        component={Receiving_main}
        initialParams={{
          company_id: company_id,
          branch_id: branch_id,
          company_code: company_code,
          user_id: user_id,
          allow_delete_mf: allow_delete_mf,
        }}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Upload Receiving"
        component={Upload_Receiving}
        initialParams={{
          company_id: company_id,
          branch_id: branch_id,
          company_code: company_code,
          user_id: user_id,
        }}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
