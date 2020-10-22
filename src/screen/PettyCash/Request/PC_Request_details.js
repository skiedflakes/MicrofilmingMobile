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

export default function PC_Request_details ({navigation:{goBack},navigation,route}) {
  
  //global params for instant loading
  const {header_id,ref_num,company_id,branch_id,company_code,user_id,allow_delete_mf} = route.params;
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

  //selected
  const[selected_chart_name,setselected_chart_name] = useState('');
  const[selected_detail_id,setselected_detail_id] = useState('');
  const[selected_doc_num,setselected_doc_num] = useState('');
  const[selected_chart_id,setselected_chart_id] = useState('');

  const [menu_list, setMenu_list] = React.useState(null);
  const [img_list, setimg_list] = React.useState(null);

  const get_main_data= () =>{
    setSpinner(true)
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    formData.append('header_id', header_id); 

    fetch(global.global_url+'/pettycash_request/get_pc_request_data_details.php', {
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
          detail_id:item.pettycash_detail_id,
          amount:item.amount,
          doc_num:item.doc_num,
          chart_id: item.gchart_id,
          chart_name: item.chart,
        };
        });
        console.log(responseJson);
        setMenu_list(data);
    }).catch((error) => {

    console.error(error);
    setSpinner(false)
    Alert.alert('Internet Connection Error');
    });
  }
  const get_images_data= (details_id) =>{
    setimage_data_loaded(false);
    setimg_list('');
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    formData.append('branch_id', branch_id); 
    formData.append('reference_number', ref_num);
    formData.append('module',module );
    formData.append('mf_reference_id',details_id );
    formData.append('primary_url', global.notes_web_directory);

    console.log(ref_num+" "+company_code+" "+company_id+" "+ branch_id+" "+module+" "+global.notes_web_directory )
     
    fetch(global.global_url+'/pettycash_request/get_micro_filming_img_details.php', {
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
          id: item.id,
          url: item.slug,
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

  const show_modal_main = (chart_name,detail_id,doc_num,chart_id) =>{
    setmodal_main_Visible(true);
    setselected_chart_name(chart_name);
    setselected_detail_id(detail_id);
    setselected_doc_num(doc_num);
    setselected_chart_id(chart_id);
  }

  //modal view images
  const [modal_img_Visible, setmodal_img_Visible] = useState(false);

  //select delete image functiuon
  const [find_image_index, setfind_image_index] = useState('');
  const [selected_image_id, setselected_image_id] = useState('');
  const [delete_modalVisible, setdelete_modalVisible] = useState(false);

   //delete image function
   const view_image = () => {
    setmodal_img_Visible(true);
    setselected_image_id(img_list[0].id);
  };
 
  const delete_image = (id) => {
    if (allow_delete_mf == 1) {
      setSpinner(true);
      const formData = new FormData();
      formData.append('company_code', company_code);
      formData.append('company_id', company_id);
      formData.append('branch_id', branch_id);
      formData.append('id', id);
      fetch(global.global_url + '/delete_micro_filming.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setdelete_modalVisible(!delete_modalVisible);
          setSpinner(false);
          if (responseJson == 1) {
            setmodal_img_Visible(!modal_img_Visible);
            setmodal_main_Visible(false);
            Alert.alert('Delete Success!');
          } else {
            Alert.alert('Something went wrong try again');
          }
        })
        .catch((error) => {
          setdelete_modalVisible(!delete_modalVisible);
          setSpinner(false);
          console.error(error);
          Alert.alert('Internet Connection Error');
        });
    } else {
      Alert.alert('User Account restricted');
    }
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
            
              <Text style={{flex:0.8,alignSelf:'center', textAlign:"center",}}>{selected_chart_name}</Text>
              </View>
              <View style={{flexDirection: 'row', padding:2,marginTop:10}} >
                  <TouchableOpacity   onPress={() => {setmodal_main_Visible(false);  navigation.navigate('Upload Request details',{chart_id:selected_chart_id,doc_num:selected_doc_num,ref_num:ref_num,detail_id:selected_detail_id,chart_name:selected_chart_name,user_id:user_id});}} style={styles.rounded_btn}>
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
            <View style={{flexDirection: 'row-reverse', backgroundColor: 'black'}}>
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

            <TouchableHighlight
            style={{...styles.openButton, backgroundColor: 'black'}}
            onPress={() => {
            setdelete_modalVisible(!delete_modalVisible);
            }}>
          
            <View style={{flexDirection: 'row-reverse', padding: 10}}>
              <AntDesign name="delete" size={20} color={'white'} />
            </View>
          </TouchableHighlight>
          </View>


            <ImageViewer imageUrls={img_list}
            loadingRender={console.log("rendering")}
            onChange={(index) => {
              setselected_image_id(img_list[index].id);
              //  console.log(img_list[index].id)
             }}
            />

            </Modal>
              {/* end image modal */}

{/* delete img modal */}
<Modal
        animationType="slide"
        transparent={true}
        visible={delete_modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete?</Text>

            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    delete_image(selected_image_id);
                  }}
                  style={styles.rounded_btn}>
                  <View style={{flexDirection: 'row'}}>
                  
                    <Text
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                     Yes
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    setdelete_modalVisible(!delete_modalVisible);
                  }}
                  style={styles.rounded_btn}>
                  <View style={{flexDirection: 'row'}}>
                    
                    <Text
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                     Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>


          </View>
        </View>
      </Modal>
{/* end delete img modal */}
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
    <Text style={{fontSize:20,textAlign:"center"}}>{ref_num}</Text>
        </View>
      </TouchableHighlight>
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
                doc_num={item.doc_num} 
                detail_id={item.detail_id} 
                chart_name={item.chart_name}
                chart_id={item.chart_id}
               />
              }
            keyExtractor={item => item.detail_id.toString()}
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

function RowItem ({navigation,chart_name,detail_id,show_modal_main,get_images_data,doc_num,chart_id}) {
  return (
      <TouchableOpacity   onPress={() => {
        show_modal_main(chart_name,detail_id,doc_num,chart_id);
        get_images_data(detail_id);
      }}>
          <View style={styles.item}>
            <View style={{flex: 3}}>
                <Text style={styles.title}>{chart_name}</Text>
                <Text style={styles.text_inv}>Doc #: {doc_num}</Text>
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
        color: '#4A4A4A',
        padding: 5,
        fontSize: 18,
        fontWeight: 'bold',
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
      }, text_inv: {
        color: '#4A4A4A',
        padding: 5,
        fontSize: 15,
      },
       
})
