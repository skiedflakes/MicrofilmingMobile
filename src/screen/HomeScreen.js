import React, { useState, useEffect } from 'react';
import { Text, View,Alert,StyleSheet,TouchableOpacity,ScrollView,FlatList,TouchableHighlight,Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
    name:"Test Module1",
  },
  {
  id:"4",
  name:"Test Module2",
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

  const FlatListItemSeparator_modal = () => {
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

  export default function HomeScreen ({navigation:{goBack},navigation,route}) {
  const { company_id,company_code,user_id } = route.params;


  const [menu_list, setMenu_list] = React.useState(null);
  const [content, setcontent] = React.useState(null);
  const [selected_farm_location, setselected_farm_location] = React.useState("");
  const [selected_farm_location_id, setselected_farm_location_id] = React.useState("");
  const [allow_navigation,setallow_navigation] = React.useState(false);
  
  //modalbranch
  const [modalVisible, setModalVisible] = useState(false);
  const [branch_data, setBranch_data] = useState('');


  const onSelectBranch = (branch_name,branch_id) =>{
    setModalVisible(false);

    set_branch_offline_db('branch_details',{'branch_details':1,'branch_name':branch_name,'branch_id':branch_id})
    setselected_farm_location(branch_name);
    setselected_farm_location_id(branch_id);
    setallow_navigation(true);
              
  }

  const set_branch_offline_db = async (key,value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };

  const logout = () =>{
    goBack();
    AsyncStorage.clear();
    // Alert.alert('offline storage cleared');
  }

  useFocusEffect(
    React.useCallback(() => {
      setselected_farm_location('Select Farm Location');
    //ASYNC STORAGE REMOVE ALL PRE-SELECTED ADDITIONS
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0];
            var jsonPars = JSON.parse(store[i][1]);
            if(jsonPars.user_details==1){

            }else if(jsonPars.branch_details==1){
              setselected_farm_location(jsonPars.branch_name)
              setselected_farm_location_id(jsonPars.branch_id)
              setallow_navigation(true);
            }else{
            }
          });
        });
    });

    get_branch();
    setMenu_list(mydata);
      return () => {
      };
    }, [])
  );


  const get_branch= () =>{
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    fetch(global.global_url+'get_branch.php', {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
    },
    body: formData

    }).then((response) => response.json())
    .then((responseJson) => {
    var data = responseJson.array_data.map(function(item,index) {
        return {
        branch_id:item.branch_id,
        branch_name: item.branch_name
        };
        });
        setBranch_data(data);
    }).catch((error) => {

    console.error(error);
    Alert.alert('Internet Connection Error');
    });


  }

  return (
    <View style={styles.main}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}>
              <View style={styles.centeredView}>
              <View style={styles.modalView}>
    
              <Text style={styles.modalText}>Select Farm Location</Text>
                          <FlatList
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          style={{alignContent:"center",margin:2}}
                          data={branch_data}
                          renderItem={
                          ({ item }) => 
                          <RowItem_modal
                              onSelect = {onSelectBranch}
                              branch_id={item.branch_id} 
                              branch_name={item.branch_name} />
                          }
                          keyExtractor={item => item.branch_id.toString()}
                          ItemSeparatorComponent = { FlatListItemSeparator_modal }
                          />
              </View>
              </View>
        </Modal>
    <View style={styles.header} >

    <View style={{ flex:6,  flexDirection: 'row', padding:2,}} >

    <TouchableOpacity     onPress={() => {
          setModalVisible(true);
        }} style={{color:'#ffff',alignSelf:'center',marginLeft:20,fontSize:20}}>
      <View style={{flexDirection:"row"}}>
      <Entypo  name="location" size={15} color={"#ffff"} style={{alignContent:'center',alignSelf:'center', color:'#ffff'}}/>
      <Text style={{color:'#ffff',alignSelf:'center',marginLeft:10,fontSize:12}}>{selected_farm_location}
      </Text>
   
      </View>
      </TouchableOpacity> 

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
                allow_navigation={allow_navigation}
                id={item.id}
                branch_id={selected_farm_location_id}
                company_code={company_code}
                company_id={company_id}
                user_id={user_id}
                 />
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


function RowItem ({navigation,title,id,allow_navigation,branch_id,company_code,company_id,user_id}) {
  return (
      <TouchableOpacity onPress={() => getContent(navigation,title,id,allow_navigation,branch_id,company_code,company_id,user_id)}>
          <View style={styles.item}>
            <View style={{flex:3,flexDirection:'row',alignItems:"center"}}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <MaterialIcons style={{alignSelf:'center'}} name="keyboard-arrow-right" size={25} color={"#4ABBE5"}/>
          </View>
      </TouchableOpacity>
  );
}

function RowItem_modal ({branch_id,branch_name,onSelect}) {
  return (
      <TouchableOpacity onPress={() =>  onSelect(branch_name,branch_id)}>
          <View style={styles.item_modal}>
            <View style={{flex:3,flexDirection:'row',alignItems:"center"}}>
              <Text >{branch_name}</Text>
            </View>
          </View>
      </TouchableOpacity>
  );
}

function getContent(navigation,name,id,allow_navigation,branch_id,company_code,company_id,user_id){
  console.log(allow_navigation)
  if(allow_navigation){
    if(id==1){ // load Abort
      navigation.navigate("Deliveries",{branch_id:branch_id,company_code,company_id,user_id});
    }else if(id==2){ // load items
     Alert.alert("Under Development");
    }else if(id==3){ // load items
      // navigation.navigate("Test Screen");
      Alert.alert("Under Development");
    } else if(id==4){ // load items
        // navigation.navigate("Test Screen");
        Alert.alert("Under Development");
    }else{
  
    
    }
  }else{
    Alert.alert('Please Select Farm Location')
  }

}



const styles = StyleSheet.create({
  item_modal: {
 
    paddingLeft:10,
    backgroundColor:'#ffff',
    padding:18,
    alignContent:"center",
    alignItems:"center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
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
