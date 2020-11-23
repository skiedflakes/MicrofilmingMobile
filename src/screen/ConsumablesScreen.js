import * as React from 'react';
import {StyleSheet, Button, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import Consumables_main from './Consumables/Consumables_main';
import Upload_Receiving from './Receiving/Upload_Receiving';

const Stack = createStackNavigator();
export default function ConsumablesScreen({route}) {
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
        name="Consumables main"
        component={Consumables_main}
        initialParams={{
          company_id: company_id,
          branch_id: branch_id,
          company_code: company_code,
          user_id: user_id,
          allow_delete_mf: allow_delete_mf,
        }}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
