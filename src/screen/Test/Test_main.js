import {StyleSheet, Text, View, FlatList,ActivityIndicator} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import ImageViewer from 'react-native-image-zoom-viewer';
import { SearchBar } from 'react-native-elements';
import React, { useState, useEffect } from 'react';


const API_ENDPOINT = 'https://randomuser.me/api/?seed=1&page=1&results=20';

export default function Test_main () {

  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [heroes, setHeroes] = useState([]);
  const fetchData = async () => {
    const res = await fetch('https://api.opendota.com/api/heroes');
    const json = await res.json();
    setData(json);
    setHeroes(json.slice());
  };
  const formatNames = (hero) => {
    let heroName = hero.name.charAt(14).toUpperCase() + hero.name.slice(15);
    heroName = heroName.replace(/_/g, " ");
    return heroName;
 }
 const updateQuery = (input) => {
  setQuery(input);
  console.log(query);
  setHeroes(data.slice());
}
const filterNames = (hero) => {
  // 1.
  let search = query.toLowerCase().replace(/ /g,"_"); 
  //2.
  if(hero.name.startsWith(search, 14)){
     //3.
     return formatNames(hero);
  }else{ 
     //4.
     heroes.splice(heroes.indexOf(hero), 1);
     return null;
  }
 
}
  useEffect(() => {
    fetchData();
  }, []);

 return (
   <View>
  <SearchBar
  onChangeText={updateQuery}
  value={query}   
  placeholder="Type Here..."/>
<FlatList data={heroes} keyExtractor = {(i)=>i.id.toString()}
  extraData = {query} 
  renderItem = {({item}) =>
     <Text style={styles.flatList}>{filterNames(item)}
     </Text>} 
/>
  </View>
  );
};
const styles = StyleSheet.create({
  flatList:{
      paddingLeft: 15, 
      marginTop:15, 
      paddingBottom:15,
      fontSize: 20,
      borderBottomColor: '#26a69a',
      borderBottomWidth:1
  }
});