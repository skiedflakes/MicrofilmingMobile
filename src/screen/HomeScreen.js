import React, { useState, useEffect } from 'react';
import { Text, View,Alert,StyleSheet,TouchableOpacity,ScrollView,FlatList,SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
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
    name:"Test Navigation",
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

export default function HomeScreen ({navigation:{goBack},navigation}) {
  const [menu_list, setMenu_list] = React.useState(null);
  var [content, setcontent] = React.useState(null);

  const logout = () =>{
    goBack();
    AsyncStorage.clear();
    Alert.alert('offline storage cleared');
  }

  useFocusEffect(
    React.useCallback(() => {
        setMenu_list(mydata);
      return () => {
      };
    }, [])
  );

  return (
    <View style={styles.main}>
    <View style={styles.header} >

    <View style={{ flex:6,  flexDirection: 'row', padding:2,}} >
      <Text style={{color:'#ffff',alignSelf:'center',marginLeft:20,fontSize:20}}>Microfilming Mobile</Text>
      <TouchableOpacity style={{flex:5.5,flexDirection:'row-reverse',}} onPress={() =>logout()}>
      <MaterialCommunityIcons  name="logout" size={25} color={"#ffff"} style={{alignContent:'center',alignSelf:'center', color:'#ffff',padding:10}}/>
      <Text style={{alignContent:'center',alignSelf:'center', color:'#ffff'}} onPress={() =>logout()}>Logout</Text>
      </TouchableOpacity>
    </View>
    </View>
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

function getContent(navigation,name,id){
  if(id==1){ // load Abort
    navigation.navigate("Deliveries");
  }else if(id==2){ // load items
    navigation.navigate("Adopt");
  }
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
