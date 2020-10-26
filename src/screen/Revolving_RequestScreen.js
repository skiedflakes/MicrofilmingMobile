import * as React from 'react';
import { StyleSheet,Button, Text, View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import RF_Request_main from  './RevolvingFund/Request/RF_Request_main';
import RF_Request_details from  './RevolvingFund/Request/RF_Request_details';
import Upload_RF_main from  './RevolvingFund/Request/Upload_RF_Request';
import Upload_RF_details from  './RevolvingFund/Request/Upload_RF_Request_details';

const Stack = createStackNavigator();
export default function PettyCash_RequetScreen({route}) {
  //global params for instant loading
  const { company_id,branch_id,company_code,user_id, allow_delete_mf } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Revolving Fund Request"
        component={RF_Request_main}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id,allow_delete_mf: allow_delete_mf,}}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Revolving Fund Request details"
        component={RF_Request_details}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id,}}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Upload Revolving Fund main"
        component={Upload_RF_main}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id }}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Upload Revolving Fund details"
        component={Upload_RF_details}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id }}
        options={{ headerShown: false }}
      />


    </Stack.Navigator>
  );
}