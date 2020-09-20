import React, { useState, useEffect } from 'react';
import { Text, View,Alert,StyleSheet,TouchableOpacity,ScrollView,FlatList,TouchableHighlight,Button,Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import DateTimePicker from '@react-native-community/datetimepicker';
import ImageViewer from 'react-native-image-zoom-viewer';


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



const images = [{
  // Simplest usage.
  url: 'http://192.168.41.1/microfilming/img/cake2.jpg',

  // width: number
  // height: number
  // Optional, if you know the image size, you can set the optimization performance

  // You can pass props to <Image />.
  props: {
      // headers: ...
  }
}, {
  url: '',
  props: {
      // Or you can set source directory.
      source: require('../../asset/cake1.jpg')
  }
}]

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

export default function Deliveries_main ({navigation:{goBack},navigation,route}) {
  
  //global params for instant loading
  const { company_id,branch_id,company_code } = route.params;

  //selected
  const[selected_dr_number,setselected_dr_number] = useState('');
  const[selected_dr_id,setselected_dr_id] = useState('');

  const [menu_list, setMenu_list] = React.useState(null);
  const [content, setcontent] = React.useState(null);

  const logout = () =>{
    goBack();
    AsyncStorage.clear();
    Alert.alert('offline storage cleared');
  }

  const get_deliveries_data= () =>{
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    fetch(global.global_url+'/deliveries/get_deliveries_data.php', {
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
          dr_header_id:item.dr_header_id,
        delivery_number: item.delivery_number
        };
        });
        setMenu_list(data);
    }).catch((error) => {

    console.error(error);
    Alert.alert('Internet Connection Error');
    });


  }

  //main modal
  const [modal_main_Visible, setmodal_main_Visible] = useState(false);

  const show_modal_main = (dr_number,dr_id) =>{
    setmodal_main_Visible(true);
    setselected_dr_number(dr_number);
    setselected_dr_id(dr_id);
  }

  //modal view images
  const [modal_img_Visible, setmodal_img_Visible] = useState(false);


  //date
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [selected_date, setselected_date] = useState('Please Select Date')
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
    setShow(Platform.OS === 'ios' ? true : false);
    var mdate ='';
    var Y = selectedDate.getFullYear();
    var mm ='';
    var dd='';

    if((selectedDate.getMonth()+1).toString().length>1){
      mm =selectedDate.getMonth()+1; 
    }else{
      mm ='0'+(selectedDate.getMonth()+1); 
    }

    if(selectedDate.getDate().toString().length==1){
      dd ='0'+selectedDate.getDate(); 
    }else{
      dd =selectedDate.getDate(); 
    }
 
    mdate = Y+'-'+mm+'-'+dd;
    setselected_date(mdate);
    
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  useFocusEffect(
    React.useCallback(() => {
    


    get_deliveries_data();
      return () => {
      };
    }, [])
  );

  return (
    <View style={styles.main}>

      {/* //Main modal */}
 


      <Modal
        animationType="fade"
        transparent={true}
        visible={modal_main_Visible}
        backdropColor={'green'}
       backdropOpacity= {1}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }} >
          
        <View style={styles.centeredView}>
          <View style={styles.main_modalView}>
          
          <View style={{flexDirection: 'row', padding:2,}} >
            
          <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>{selected_dr_number}</Text>
          </View>
          <View style={{flexDirection: 'row', padding:2,marginTop:10}} >
              <TouchableOpacity   onPress={() => {setmodal_main_Visible(false);  navigation.navigate('Upload Deliveries');}} style={styles.rounded_btn}>
                <View style={{ flexDirection: "row",}} >
                  <MCI  name="image-plus" size={20} color={"black"}/> 
                  <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>Add Image</Text>
                </View>
              </TouchableOpacity>
           </View>


            <View style={{flexDirection: 'row', padding:2,marginTop:10}} >
              <TouchableOpacity  onPress={() => {setmodal_img_Visible(true);}} style={styles.rounded_btn}>
                <View style={{ flexDirection: "row",}} >
                  <MaterialIcons  name="image-search" size={20} color={"black"}/> 
                  <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>View</Text>
                </View>
              </TouchableOpacity>
           </View>
           <View style={{flexDirection: 'row', padding:2,marginTop:10}} >
              <TouchableOpacity  onPress={() => {setmodal_main_Visible(false);}} style={styles.rounded_btn}>
                <View style={{ flexDirection: "row",}} >
   
                  <Text style={{flex:1,alignSelf:'center', textAlign:"center",}}>Close</Text>
                </View>
              </TouchableOpacity>
           </View>

           
          </View>
        </View>
      </Modal>


      {/* //image modal */}

            <Modal
              animationType="fade"
              transparent={true}
              visible={modal_img_Visible}
              transparent={true}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "black" }}
              onPress={() => {
                setmodal_img_Visible(!modal_img_Visible);
              }}
            >
              <View style={{flexDirection:"row-reverse",padding:10}}>
              <AntDesign  name="closecircleo" size={20} color={"white"}/> 
              </View>
            </TouchableHighlight>
            <ImageViewer imageUrls={images}/>

            </Modal>
              {/* end image modal */}


     <View style={styles.header} >

              <View style={{ flex:1,  flexDirection: 'row', padding:2,}} >
      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          goBack()
        }}
      >
        <View style={{alignContent:"center",alignItems:"center",alignSelf:"center",  flexDirection: 'row', padding:2,}} >
        <AntDesign  style={{marginRight:10}} name="arrowleft" size={20} color={"black"}/> 
        <Text style={{fontSize:20,textAlign:"center"}}>Deliveries</Text>
        </View>
      </TouchableHighlight>
      </View>
      </View>
        <View style={styles.header} >


        <View style={{ flex:6,  flexDirection: 'row', padding:5,}} >
      <Text style={styles.text_header}>Date</Text>
        {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
        <TouchableOpacity onPress={showDatepicker} style={styles.date_picker}>
          <View style={{ flexDirection: "row",}} >
        <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>{selected_date}</Text>
            <View style={{flex:0.2,flexDirection:"row-reverse",alignContent:'center',alignContent:"center",alignSelf:'center',}}
            >
              <FontAwesome  name="calendar" size={17} color={"gray"}/> 
            </View>
            
            {/* */}
          </View>
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
              show_modal_main={show_modal_main}
                navigation={navigation}
                dr_header_id={item.dr_header_id} 
                delivery_number={item.delivery_number} />
              }
            keyExtractor={item => item.dr_header_id.toString()}
            ItemSeparatorComponent = { FlatListItemSeparator }
        />
    </View>     
      {/* {content} */}

    </View>
    </View>
  );
}

function RowItem ({navigation,delivery_number,dr_header_id,show_modal_main}) {
  return (
      <TouchableOpacity   onPress={() => {
        show_modal_main(delivery_number,dr_header_id);
      }}>
          <View style={styles.item}>
            <View style={{flex:3,flexDirection:'row',alignItems:"center"}}>
              <Text style={styles.title}>{delivery_number}</Text>
            </View>
            <MaterialIcons style={{alignSelf:'center'}} name="keyboard-arrow-right" size={25} color={"#4ABBE5"}/>
          </View>
      </TouchableOpacity>
  );
}




























const styles = StyleSheet.create({

  rounded_btn:{
    flex:0.8,
    alignContent:"center",
    alignSelf:"center",
    borderWidth:1,
    padding: 10,
    borderColor: "gray",
    borderRadius:8
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
      text_header: {
        alignContent:"center",
        alignSelf:"center",
        textAlign:"center",
        borderWidth:1,
        padding: 10,
        borderColor: "gray",
        borderBottomLeftRadius:8,
        borderTopLeftRadius:8,
        flex:0.2
      },
      date_picker:{
        flex:0.8,
        alignContent:"center",
        alignSelf:"center",
        borderWidth:1,
        padding: 10,
        borderColor: "gray",
        borderBottomRightRadius:8,
        borderTopRightRadius:8
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
        elevation: 5,
      },
        main_modalView: {
          margin: 10,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 25,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        elevation: 10
      },
       
})
