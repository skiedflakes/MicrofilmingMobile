import * as React from 'react';
import { StyleSheet,Button, Text, View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import RF_Replenish_main from './RevolvingFund/Replenish/RF_Replenish_main';
import RF_Replenish_upload from './RevolvingFund/Replenish/RF_Replenish_upload_main';

const Stack = createStackNavigator();
export default function PettyCash_ReplenishScreen({route}) {
  //global params for instant loading
  const { company_id,branch_id,company_code,user_id,allow_delete_mf } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Revolving Fund Replenish"
        component={RF_Replenish_main}
        initialParams={{company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id,allow_delete_mf: allow_delete_mf,}}
        options={{ headerShown: false }}
      />

    <Stack.Screen
        name="Revolving Fund Replenish Upload"
        component={RF_Replenish_upload}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id }}
        options={{ headerShown: false }}
    />

    </Stack.Navigator>
  );
}