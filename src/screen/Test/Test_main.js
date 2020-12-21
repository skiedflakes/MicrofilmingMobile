import {StyleSheet, Text, View, FlatList, ScrollView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import ImageViewer from 'react-native-image-zoom-viewer';
import {SearchBar} from 'react-native-elements';
import React, {useState, useEffect} from 'react';
import AnimatedExample from '../Components/test/animated';
const style = {flex: 1, backgroundColor: '#fff'};
export default function Test_main() {
  return (
    <ScrollView style={style}>
      <AnimatedExample />
      {/*  */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  flatList: {
    paddingLeft: 15,
    marginTop: 15,
    paddingBottom: 15,
    fontSize: 20,
    borderBottomColor: '#26a69a',
    borderBottomWidth: 1,
  },
});
