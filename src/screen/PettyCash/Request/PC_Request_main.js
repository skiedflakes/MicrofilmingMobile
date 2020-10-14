import React, { useState, useEffect } from 'react';
import { Text, View,Alert,StyleSheet,TouchableOpacity,ScrollView,FlatList,TouchableHighlight,Button,Modal,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import DateTimePicker from '@react-native-community/datetimepicker';
import ImageViewer from 'react-native-image-zoom-viewer';

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

export default function PC_Request_main ({navigation:{goBack},navigation,route}) {
  
  //global params for instant loading
  const { company_id,branch_id,company_code,user_id } = route.params;
  const module = 'PCV'; // module
  const [image_data_loaded,setimage_data_loaded] = useState(false);
  const [image_found,setimage_found]= useState(false);
  const [spinner, setSpinner] = React.useState(false);

  //main function
  useFocusEffect(
    React.useCallback(() => {
 
      get_main_data();
      return () => {
      };
    }, [])
  );

  const on_generate_report = () =>{
    get_main_data();
  }

  //selected
  const[selected_ref_num,setselected_ref_num] = useState('');
  const[selected_header_id,setselected_header_id] = useState('');
  const[details_status,setdetails_status] = useState('');

  const [menu_list, setMenu_list] = React.useState(null);
  const [img_list, setimg_list] = React.useState(null);
  const [content, setcontent] = React.useState(null);

  const logout = () =>{
    goBack();
    AsyncStorage.clear();
    Alert.alert('offline storage cleared');
  }

  const get_main_data= () =>{
    setSpinner(true)
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    formData.append('branch_id', branch_id); 
    formData.append('start_date', selected_start_date);
    formData.append('end_date', selected_end_date);

    console.log(user_id+" "+company_code+" "+company_id+" "+branch_id+" "+selected_start_date+" "+selected_end_date)

    fetch(global.global_url+'/pettycash_request/get_pc_request_data.php', {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
    },
    body: formData

    }).then((response) => response.json())
    .then((responseJson) => {
      setSpinner(false)
    var data = responseJson.array_data.map(function(item,index) {
        return {
          header_id:item.header_id,
          ref_num: item.ref_num,
          details_status: item.details_status
        };
        });
        console.log(data);
        setMenu_list(data);
    }).catch((error) => {

    console.error(error);
    setSpinner(false)
    Alert.alert('Internet Connection Error');
    });
  }


  const get_images_data= (reference_number) =>{
    setimage_data_loaded(false);
    setimg_list('');
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    formData.append('branch_id', branch_id); 
    formData.append('reference_number', reference_number);
    formData.append('module',module );
    formData.append('primary_url', global.notes_web_directory);



    fetch(global.global_url+'/pettycash_request/get_micro_filming_img.php', {
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
          url:item.slug,
          
        };
        });

        console.log(responseJson)
        
        if(data.length>0){
       
          setimg_list(data);
          setimage_found(true);
        }else{
          setimg_list('');
          setimage_found(false)
        }
        setimage_data_loaded(true);
        // 
    }).catch((error) => {

    console.error(error);
    Alert.alert('Internet Connection Error');
    });
  }

  //main modal
  const [modal_main_Visible, setmodal_main_Visible] = useState(false);

  const show_modal_main = (ref_num,header_id,details_status) =>{
    setmodal_main_Visible(true);
    setselected_ref_num(ref_num);
    setselected_header_id(header_id);
    setdetails_status(details_status);
  }

  //modal view images
  const [modal_img_Visible, setmodal_img_Visible] = useState(false);


  //date
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');

  

  const [show_end_date, setshow_end_date] = useState(false);

  const [show_start_date, setshow_start_date] = useState(false);


        //setup state start date
        var start_date ='';
        var start_raw_date =  new Date(); 
        var Y = start_raw_date.getFullYear();
        var mm ='';
        var dd='';
    
        if((start_raw_date.getMonth()+1).toString().length>1){
          mm =start_raw_date.getMonth()+1; 
        }else{
          mm ='0'+(start_raw_date.getMonth()+1); 
        }
     
        start_date = Y+'-'+mm+'-'+'01';
   
   
   
        //setup state end date
        var end_date =  '';
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); // get last day of the month
        var e_Y = lastDay.getFullYear();
        var e_mm = ''
        var e_dd =lastDay.getDate();
   
        if((lastDay.getMonth()+1).toString().length>1){
         e_mm =lastDay.getMonth()+1; 
       }else{
         e_mm ='0'+(lastDay.getMonth()+1); 
       }
   
       end_date = e_Y+'-'+e_mm+'-'+e_dd;

  const [selected_start_date, setselected_start_date] =   useState(start_date);
  const [selected_end_date, setselected_end_date] =   useState( end_date);
  // const [selected_date, setselected_date] =   useState( new Date().toDateString());
  const onChange_start_date = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
    setshow_start_date(Platform.OS === 'ios' ? true : false);
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
    setselected_start_date(mdate);
    
  };

  
  const onChange_end_date = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
    setshow_end_date(Platform.OS === 'ios' ? true : false);
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
    setselected_end_date(mdate);
    
  };



  const showMode = currentMode => {
    setshow_start_date(true);
    setMode(currentMode);
  };
  const showMode2 = currentMode => {
    setshow_end_date(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showDatepicker2 = () => {
    showMode2('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };





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
        setmodal_main_Visible(!modal_main_Visible);
        }} >
          
          
        <View style={styles.centeredView}>
 
            {image_data_loaded? 
                   <View style={styles.main_modalView}>
              <View style={{flexDirection: 'row', padding:2,}} >
            
              <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>{selected_ref_num}</Text>
              </View>
              <View style={{flexDirection: 'row', padding:2,marginTop:10}} >
                  <TouchableOpacity   onPress={() => {setmodal_main_Visible(false);  navigation.navigate('Upload Request',{ref_num:selected_ref_num,user_id:user_id});}} style={styles.rounded_btn}>
                    <View style={{ flexDirection: "row",}} >
                      <MCI  name="image-plus" size={20} color={"black"}/> 
                      <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>Add Image</Text>
                    </View>
                  </TouchableOpacity>
               </View>
                <View style={{flexDirection: 'row', padding:2,marginTop:10}} >
                  <TouchableOpacity  onPress={() => {image_found? setmodal_img_Visible(true):Alert.alert('No image Available') }} style={styles.rounded_btn}>
                    <View style={{ flexDirection: "row",}} >
                      <MaterialIcons  name="image-search" size={20} color={"black"}/> 
                      <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>View Image</Text>
                    </View>
                  </TouchableOpacity>
               </View>

                {details_status>0?
                <View style={{flexDirection: 'row', padding:2,marginTop:10}} >
                  <TouchableOpacity  onPress={() => {setmodal_main_Visible(false); navigation.navigate('Petty Cash Request details',{ref_num:selected_ref_num,header_id:selected_header_id,company_id: company_id,branch_id: branch_id,company_code: company_code,user_id:user_id});}} style={styles.rounded_btn}>
                    <View style={{ flexDirection: "row",}} >
                      <MaterialIcons  name="image-search" size={20} color={"black"}/> 
                      <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>Show Records</Text>
                    </View>
                  </TouchableOpacity>
               </View>:null}


               <View style={{flexDirection: 'row', padding:2,marginTop:10}} >
                  <TouchableOpacity  onPress={() => {setmodal_main_Visible(false);}} style={styles.rounded_btn}>
                    <View style={{ flexDirection: "row",}} >
       
                      <Text style={{flex:1,alignSelf:'center', textAlign:"center",}}>Close</Text>
                    </View>
                  </TouchableOpacity>
               </View>
               </View>
            :
            <View style={styles.main_modalView}>
            <ActivityIndicator size="small" color="#4ABBE5" />
            </View>
            }
        </View>
      </Modal>


      {/* //image modal */}

            <Modal
              animationType="fade"
              transparent={true}
              visible={modal_img_Visible}
              transparent={true}
              onRequestClose={() => {
                setmodal_img_Visible(!modal_img_Visible);
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
            <ImageViewer imageUrls={img_list}
            loadingRender={console.log("rendering")}/>

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
        <Text style={{fontSize:20,textAlign:"center"}}>Petty Cash Request</Text>
        </View>
      </TouchableHighlight>
      </View>
      </View>
        <View style={styles.header_date} >
            <View style={{flexDirection:"column",flex:1}}>
                      <View style={{  flexDirection: 'row', padding:5,}} >
                      <Text style={styles.text_header}>Start Date</Text>
                        {show_start_date && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={date}
                          mode={mode}
                          is24Hour={true}
                          display="default"
                          onChange={onChange_start_date}
                        />
                      )}
                        <TouchableOpacity onPress={showDatepicker} style={styles.date_picker}>
                          <View style={{ flexDirection: "row",}} >
                        <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>{selected_start_date}</Text>
                            <View style={{flex:0.2,flexDirection:"row-reverse",alignContent:'center',alignContent:"center",alignSelf:'center',}}
                            >
                              <FontAwesome  name="calendar" size={17} color={"gray"}/> 
                            </View>
                            
                            {/* */}
                          </View>
                        </TouchableOpacity>
                    
                      </View>

                      <View style={{flexDirection: 'row', padding:5,}} >
                      <Text style={styles.text_header}>End Date</Text>
                        {show_end_date && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={date}
                          mode={mode}
                          is24Hour={true}
                          display="default"
                          onChange={onChange_end_date}
                        />
                      )}
                        <TouchableOpacity onPress={showDatepicker2} style={styles.date_picker}>
                          <View style={{ flexDirection: "row",}} >
                        <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>{selected_end_date}</Text>
                            <View style={{flex:0.2,flexDirection:"row-reverse",alignContent:'center',alignContent:"center",alignSelf:'center',}}
                            >
                              <FontAwesome  name="calendar" size={17} color={"gray"}/> 
                            </View>
                            
                            {/* */}
                          </View>
                        </TouchableOpacity>
                    
                      </View>
                      <View style={{flexDirection: 'row', padding:5,alignSelf:"center",}} >
                      <TouchableOpacity style={{
                            backgroundColor:"#4ABBE5",flex:1,
                            borderWidth: 1.5,
                            borderColor:"#4ABBE5",
                            borderRadius:10,
                            alignContent:"center",
                            alignSelf:"center",
                            alignItems:"center"
                      }} onPress={on_generate_report}>

                      <View style={{ flexDirection: "row",}} >
                      <Text style={{
                      
                      color:"#ffff",
                      padding:5,
                     
                      textAlign:'center',
                      fontSize:15,
                      fontWeight:'bold',
                      alignContent:"center",
                      alignSelf:"center",
                      alignItems:"center"
             
                      }}> <AntDesign  name="sync" size={15} color={"white"}/>  Generate Report</Text> 
                          </View>
                        
                      </TouchableOpacity>
                    
                      </View>
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
              get_images_data ={get_images_data}
              show_modal_main={show_modal_main}
                navigation={navigation}
                header_id={item.header_id} 
                ref_num={item.ref_num}
                details_status={item.details_status} />
              }
            keyExtractor={item => item.header_id.toString()}
            ItemSeparatorComponent = { FlatListItemSeparator }
        />
    </View>     
      {/* {content} */}

    </View>
    {spinner && <CustomProgressBar />}
    </View>
  );
}

const CustomProgressBar = ({ visible }) => (
  <Modal onRequestClose={() => null} visible={visible} transparent={true}>
    <View style={{ alignItems: 'center', justifyContent: 'center',flex: 1 }}>
      <View style={{ borderRadius: 10, backgroundColor: '#f0f0f0', padding: 15 }}>
   
        <ActivityIndicator size="large" color="#4ABBE5" />
      </View>
    </View>
  </Modal>
);

function RowItem ({navigation,ref_num,header_id,show_modal_main,get_images_data,details_status}) {
  return (
      <TouchableOpacity   onPress={() => {
        show_modal_main(ref_num,header_id,details_status);
        get_images_data(ref_num);
      }}>
          <View style={styles.item}>
            <View style={{flex:3,flexDirection:'row',alignItems:"center"}}>
              <Text style={styles.title}>{ref_num}</Text>
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
        flexDirection:'row',
        padding:2,
        flex:0.5,
        alignContent:"center",
    },
    header_date:{
      alignItems:"center",
      alignContent:"center",
      alignSelf:"center",
      flexDirection:'row',
      padding:2,
      flex:2,
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
        padding: 7,
        borderColor: "gray",
        borderBottomLeftRadius:8,
        borderTopLeftRadius:8,
        flex:0.3
      },
      date_picker:{
        flex:0.7  ,
        alignContent:"center",
        alignSelf:"center",
        borderWidth:1,
        padding: 7,
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
