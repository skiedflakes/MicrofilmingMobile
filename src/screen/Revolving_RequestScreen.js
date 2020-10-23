import * as React from 'react';
import { StyleSheet,Button, Text, View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import PC_Request_main from './PettyCash/Request/PC_Request_main';

const Stack = createStackNavigator();
export default function PettyCash_RequetScreen({route}) {
  //global params for instant loading
  const { company_id,branch_id,company_code,user_id, allow_delete_mf } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Revolving Fund Request"
        component={PC_Request_main}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id,allow_delete_mf: allow_delete_mf,}}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}