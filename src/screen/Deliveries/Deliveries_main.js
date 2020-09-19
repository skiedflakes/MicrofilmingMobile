import React, { useState, useEffect } from 'react';
import { Text, View,Alert,StyleSheet,TouchableOpacity,ScrollView,FlatList,TouchableHighlight,Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const mydata = [
  {
    id:"1",
    name:"Deliveries",
  },
  {
    id:"2",
    name:"Petty Cash",
  },
    {
    id:"3",
    name:"Test Screen",
  },
];


const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }

export default function Deliveries_main ({navigation:{goBack},navigation}) {
  const [menu_list, setMenu_list] = React.useState(null);
  const [content, setcontent] = React.useState(null);
  const [company_id, setcompany_id] = React.useState(null);
  


  const logout = () =>{
    goBack();
    AsyncStorage.clear();
    Alert.alert('offline storage cleared');
  }

  useFocusEffect(
    React.useCallback(() => {

    //ASYNC STORAGE REMOVE ALL PRE-SELECTED ADDITIONS
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0];
            var jsonPars = JSON.parse(store[i][1]);
            if(jsonPars.user_details==1){
              setcompany_id(jsonPars.company_id);
            }else if(jsonPars.branch_details==1){
            }else{
            }
          });
        });
    });

    setMenu_list(mydata);
      return () => {
      };
    }, [])
  );

  return (
    <View style={styles.main}>
    <View style={styles.body}>
    <View style={{  flexDirection: 'row',alignContent:"center",alignItems:"center"}} >
        {/* <Text>{user}</Text> */}
        <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{alignContent:"center",margin:2}}
            data={menu_list}
            renderItem={
              ({ item }) => 
              <RowItem
                navigation={navigation}
                title={item.name} 
                id={item.id} />
              }
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent = { FlatListItemSeparator }
        />
    </View>     
      {/* {content} */}

    </View>
    </View>
  );
}


function RowItem ({navigation,title,id}) {
  return (
      <TouchableOpacity onPress={() => getContent(navigation,title,id)}>
          <View style={styles.item}>
            <View style={{flex:3,flexDirection:'row',alignItems:"center"}}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <MaterialIcons style={{alignSelf:'center'}} name="keyboard-arrow-right" size={25} color={"#4ABBE5"}/>
          </View>
      </TouchableOpacity>
  );
}





const styles = StyleSheet.create({

    main:{
        alignItems:"center",
        alignContent:"center",
        alignSelf:"center",
        flex:6,
        backgroundColor: '#ffff',
        alignContent:"center",
        flexDirection:'column'
    },

    header:{
        alignItems:"center",
        alignContent:"center",
        alignSelf:"center",
        flexDirection:'row-reverse',
        padding:2,
        flex:0.6,
        backgroundColor: '#4ABBE5',
        alignContent:"center",
    },
    body:{
        flex:5.4,
        backgroundColor: '#DADCDC',
        alignContent:"center",
        alignItems:"center",
        
    },
    container: {
        flex: 1,
        marginTop:5,
      },
      
      item: {
        flexDirection:'row',
        paddingLeft:10,
        backgroundColor:'#ffff',
        padding:5,
        alignContent:"center",
        alignItems:"center"
      },
      title: {
        color:'#4A4A4A',
        padding:15,
        fontSize: 20,
      },
})
