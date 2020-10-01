import * as React from 'react';
import { StyleSheet,Button, Text, View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator} from '@react-navigation/stack';
import PettycashLiquidation_main from './PettyCash/Liquidation/PettycashLiquidation_main';


const Stack = createStackNavigator();
export default function PettyCash_ReplenishScreen({route}) {
  //global params for instant loading
  const { company_id,branch_id,company_code,user_id } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Petty Cash Liquidation"
        component={PettycashLiquidation_main}
        initialParams={{ company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id }}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
}