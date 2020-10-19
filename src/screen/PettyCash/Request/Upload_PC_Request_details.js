import React,{useState,useRef} from 'react';
import ImagePicker from 'react-native-image-picker';
import { ActivityIndicator } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Alert,
  Platform,
  Image,
  TouchableHighlight,
  AntDesign,
  Modal
} from "react-native";


export default function Upload_PC_Request_details ({navigation:{goBack},navigation,route}) {
  
  //global params for instant loading
  const { company_id,branch_id,company_code,user_id,ref_num,detail_id,chart_name,doc_num,chart_id} = route.params;

  const [spinner, setSpinner] = React.useState(false);

  console.log(user_id);
  const [image_preview,Setimage_preview] = useState(false);
  const [imageUri,SetimageUri] = useState('');
  const [image_file_type,Setimage_file_type] = useState('');

  const addImage = () =>{
    if(!imageUri){
        Alert.alert('Please select image');
    }
    else {
      setSpinner(true)
      const formData = new FormData();

      formData.append('user_id', user_id);
      formData.append('company_code', company_code);
      formData.append('company_id', company_id);
      formData.append('branch_id', branch_id);

      formData.append('ref_num', ref_num);
      formData.append('details_id', detail_id);
      formData.append('chart_id', chart_id);
      formData.append('module', "PCV");

      formData.append('file', {
          uri: imageUri,
          name: 'my_photo',
          type: image_file_type
        });
      fetch(global.global_url+'/deliveries/upload_img.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData

      }).then((response) => response.json())
        .then((responseJson) => {
          
          var response_data = responseJson.response_json[0];
          console.log(response_data.success);

          if(response_data.success == '1'){
            goBack();
          } else {
            Alert.alert('Error upload');
          }

          setSpinner(false);

        }).catch((error) => {
          console.error(error);
          setSpinner(false);
        });
      }
  }

  const open_file = () =>{
    let options = {
        title: 'Select Image as',
        // customButtons: [
        //   { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        // ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        maxWidth: 500,
        maxHeight: 700,
        quality: 0.7
      };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        Setimage_file_type(response.type);
        SetimageUri(response.uri);
        Setimage_preview(true);
        // this.setState({
        //   avatarSource: source,
        // });
      }
    });

  }

  function renderImage(){
    if(image_preview==false){
        return (
            <Image 
            style={{height:350,width:350,alignItems:"center",alignContent:"center"}}
            source={require('../../../asset/add_image.png')} />
        );
    }else{
        return (
            <Image 
            style={{height:400,width:400,alignItems:"center",alignContent:"center",marginBottom:10,marginTop:10,borderWidth: 1.5,
            borderColor:"#4ABBE5",}}
            source={{ uri: imageUri }}
             />
        );
    }
}

return (
  <View style={styles.container}>
    <View style={{alignContent:'flex-start',alignItems:'flex-start'}}>
    <Text style={{fontSize:18,textAlign:"center",fontWeight:'bold'}}>Reference # : {ref_num}</Text>
    <Text style={{fontSize:18,textAlign:"center",fontWeight:'bold'}}>Doc # : {doc_num}</Text>
    <Text style={{fontSize:18,textAlign:"center",fontWeight:'bold'}}>Chart of Account : {chart_name}</Text>
    </View>
      <View style={styles.body}>
      <TouchableOpacity
              onPress={() => { open_file(); }}
              style={{alignItems:"center",marginBottom:10}}
              >
              { renderImage()}
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => { addImage(); }}
            style={{alignItems:"center",
            marginBottom:10,
            backgroundColor:"#4ABBE5",
            borderRadius:10,
            borderWidth: 1.5,
            borderColor:"#4ABBE5",
            alignContent:"center",
            alignSelf:"center",
            alignItems:"center",padding: 5}}
            >
            <Text style={{
                color:"#ffff",
                padding:5,
                textAlign:'center',
                fontSize:15,
                fontWeight:'bold',
                alignContent:"center",
                alignSelf:"center",
                alignItems:"center"
              }}>Upload image</Text>
        </TouchableOpacity>
      </View>
        
        {spinner && <CustomProgressBar />}
  </View>
);
}

const CustomProgressBar = ({ visible }) => (
  <Modal onRequestClose={() => null} visible={visible} transparent={true}>
    <View style={{ alignItems: 'center', justifyContent: 'center',flex: 1 }}>
      <View style={{ borderRadius: 10, backgroundColor: '#f0f0f0', padding: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: '200', marginBottom: 5 }}>Uploading...</Text>
        <ActivityIndicator size="large" color="#4ABBE5" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10
  },
  welcome: {
    fontSize: 18,
    color: '#222',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#34a853',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginVertical: 8,
  },
  direct: {
    backgroundColor: '#db7d35',
  },
  stripe: {
    backgroundColor: '#556cd6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
})