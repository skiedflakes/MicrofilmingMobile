import React, {useState} from 'react';
import {View, Button, Modal} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import ImageViewer from 'react-native-image-zoom-viewer';

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



export default function Test_main () {


  return (
    <Modal visible={true} transparent={true}>
    <ImageViewer imageUrls={images}/>
</Modal>
  );
};

