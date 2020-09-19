import React,{useState,useRef} from 'react';
import ImagePicker from 'react-native-image-picker';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Alert,
  Platform,
  Image
} from "react-native";


export default function Deliveries_main () {

  const [image_preview,Setimage_preview] = useState(false);
  const [imageUri,SetimageUri] = useState('');
  const [image_file_type,Setimage_file_type] = useState('');

  const addImage = () =>{
    if(!imageUri){
        Alert.alert('Please select image');
    }
    else {
      const formData = new FormData();
      formData.append('test_string', "variable here");
      formData.append('image', {
          uri: imageUri,
          name: 'my_photo',
          type: image_file_type
        });
      fetch('http://192.168.1.4/test_php/test.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData

      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          //var response_data = responseJson.response_json[0];

        }).catch((error) => {
          console.error(error);
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
      };
    ImagePicker.launchImageLibrary(options, (response) => {
        // Same code as in above section!

      if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          Setimage_file_type(response.type);
          SetimageUri(response.uri);
          Setimage_preview(true);
        }
    });
  }

function renderImage(){
    if(image_preview==false){
        return (
            <Image 
            style={{height:200,width:200,alignItems:"center",alignContent:"center"}}
            source={null} />
        );
    }else{
        return (
            <Image 
            style={{height:200,width:200,alignItems:"center",alignContent:"center"}}
            source={{ uri: imageUri }}
             />
        );
    }
}

return (
  <View style={styles.container}>

        {renderImage()}

        <TouchableOpacity
            onPress={() => { open_file(); }}
            style={{alignItems:"center",marginBottom:10}}
            >
            <Text>Open Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => { addImage(); }}
            style={{alignItems:"center",marginBottom:10}}
            >
            <Text>Upload</Text>
        </TouchableOpacity>
  </View>
)

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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