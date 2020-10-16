import * as React from 'react';
import { StyleSheet,Button, Text, View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import PC_Request_main from './PettyCash/Request/PC_Request_main';
import Upload_PC_Request from './PettyCash/Request/Upload_PC_Request';
import Upload_PC_Request_details from './PettyCash/Request/Upload_PC_Request_details';
import PC_Request_details from './PettyCash/Request/PC_Request_details';

const Stack = createStackNavigator();
export default function PettyCash_RequetScreen({route}) {
  //global params for instant loading
  const { company_id,branch_id,company_code,user_id } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Petty Cash Request"
        component={PC_Request_main}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id }}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Upload Request"
        component={Upload_PC_Request}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id }}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Petty Cash Request details"
        component={PC_Request_details}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id }}
        options={{ headerShown: false }}
      />
          <Stack.Screen
        name="Upload Request details"
        component={Upload_PC_Request_details}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id }}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}