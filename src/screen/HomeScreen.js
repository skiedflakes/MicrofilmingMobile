import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const mydata = [
  {
    id: '1',
    name: 'Deliveries',
  },
  {
    id: '2',
    name: 'Petty Cash',
  },
  {
    id: '3',
    name: 'Revolving Fund',
  },
  {
    id: '4',
    name: 'Receiving Stocks',
  },
  {
    id: '5',
    name: 'Purchase Order',
  },
  {
    id: '6',
    name: 'Consumables',
  },
];

const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: '#000',
      }}
    />
  );
};

const FlatListItemSeparator_modal = () => {
  return (
    <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: '#000',
      }}
    />
  );
};

export default function HomeScreen({navigation: {goBack}, navigation, route}) {
  const {company_id, company_code, user_id} = route.params;

  //privileges
  const [allow_delete_mf, setallow_delete_mf] = React.useState('');

  const [menu_list, setMenu_list] = React.useState(null);
  const [content, setcontent] = React.useState(null);
  const [selected_farm_location, setselected_farm_location] = React.useState(
    '',
  );
  const [
    selected_farm_location_id,
    setselected_farm_location_id,
  ] = React.useState('');
  const [allow_navigation, setallow_navigation] = React.useState(false);

  //modalbranch
  const [modalVisible, setModalVisible] = useState(false);
  const [branch_data, setBranch_data] = useState('');

  //modal PettyCash
  const [pc_modalVisible, setpc_modalVisible] = useState(false);

  //modal PettyCash
  const [rf_modalVisible, setrf_modalVisible] = useState(false);

  const onSelectBranch = (branch_name, branch_id) => {
    setModalVisible(false);

    set_branch_offline_db('branch_details', {
      branch_details: 1,
      branch_name: branch_name,
      branch_id: branch_id,
    });
    setselected_farm_location(branch_name);
    setselected_farm_location_id(branch_id);
    setallow_navigation(true);
  };

  const set_branch_offline_db = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };

  const logout = () => {
    goBack();
    AsyncStorage.clear();
    // Alert.alert('offline storage cleared');
  };

  var count = 1;
  useEffect(() => {
    setselected_farm_location('Select Farm Location');
    //ASYNC STORAGE REMOVE ALL PRE-SELECTED ADDITIONS
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          var jsonPars = JSON.parse(store[i][1]);
          if (jsonPars.user_details == 1) {
            setallow_delete_mf(jsonPars.allow_delete_microfilming_img);
          } else if (jsonPars.branch_details == 1) {
            setselected_farm_location(jsonPars.branch_name);
            setselected_farm_location_id(jsonPars.branch_id);
            setallow_navigation(true);
          } else {
          }
        });
      });
    });

    get_branch();
    setMenu_list(mydata);
  }, [count]); // Only re-run the effect if count changes

  const get_branch = () => {
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    formData.append('user_id', user_id);
    fetch(global.global_url + 'get_branch.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var data = responseJson.array_data.map(function (item, index) {
          return {
            branch_id: item.branch_id,
            branch_name: item.branch_name,
          };
        });
        setBranch_data(data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };

  return (
    <View style={styles.main}>
      {/* //PettyCash modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={pc_modalVisible}
        backdropColor={'green'}
        backdropOpacity={1}
        onRequestClose={() => {
          setpc_modalVisible(!pc_modalVisible);
        }}>
        <View style={styles.modal_centeredView}>
          <View style={styles.main_modalView}>
            <View style={{flexDirection: 'row', padding: 2}}>
              <Text style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                Petty Cash
              </Text>
            </View>
            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setpc_modalVisible(!pc_modalVisible);
                  navigation.navigate('Petty Cash Replenish', {
                    branch_id: selected_farm_location_id,
                    company_code,
                    company_id,
                    user_id,
                    allow_delete_mf,
                  });
                }}
                style={styles.rounded_btn}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                    Replenishment
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setpc_modalVisible(!pc_modalVisible);
                  navigation.navigate('Petty Cash Request', {
                    branch_id: selected_farm_location_id,
                    company_code,
                    company_id,
                    user_id,
                    allow_delete_mf,
                  });
                }}
                style={styles.rounded_btn}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                    Request
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setpc_modalVisible(!pc_modalVisible);
                  navigation.navigate('Petty Cash Liquidation', {
                    branch_id: selected_farm_location_id,
                    company_code,
                    company_id,
                    user_id,
                    allow_delete_mf,
                  });
                }}
                style={styles.rounded_btn}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                    Liquidation
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setpc_modalVisible(false);
                }}
                style={styles.rounded_btn}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                    Close
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* //PettyCash modal end */}

      {/* //Revolving modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={rf_modalVisible}
        backdropColor={'green'}
        backdropOpacity={1}
        onRequestClose={() => {
          setrf_modalVisible(!rf_modalVisible);
        }}>
        <View style={styles.modal_centeredView}>
          <View style={styles.main_modalView}>
            <View style={{flexDirection: 'row', padding: 2}}>
              <Text style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                Revolving Fund
              </Text>
            </View>
            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setrf_modalVisible(!rf_modalVisible);
                  navigation.navigate('Revolving Fund Replenish', {
                    branch_id: selected_farm_location_id,
                    company_code,
                    company_id,
                    user_id,
                    allow_delete_mf,
                  });
                }}
                style={styles.rounded_btn}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                    Replenishment
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setrf_modalVisible(!rf_modalVisible);
                  navigation.navigate('Revolving Fund Request', {
                    branch_id: selected_farm_location_id,
                    company_code,
                    company_id,
                    user_id,
                    allow_delete_mf,
                  });
                }}
                style={styles.rounded_btn}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                    Request
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setrf_modalVisible(!rf_modalVisible);
                  navigation.navigate('Revolving Fund Liquidation', {
                    branch_id: selected_farm_location_id,
                    company_code,
                    company_id,
                    user_id,
                    allow_delete_mf,
                  });
                }}
                style={styles.rounded_btn}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                    Liquidation
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setrf_modalVisible(false);
                }}
                style={styles.rounded_btn}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{flex: 1, alignSelf: 'center', textAlign: 'center'}}>
                    Close
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* //Revolving modal end*/}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Farm Location</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={{alignContent: 'center', margin: 2}}
              data={branch_data}
              renderItem={({item}) => (
                <RowItem_modal
                  onSelect={onSelectBranch}
                  branch_id={item.branch_id}
                  branch_name={item.branch_name}
                />
              )}
              keyExtractor={(item) => item.branch_id.toString()}
              ItemSeparatorComponent={FlatListItemSeparator_modal}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <View style={{flex: 6, flexDirection: 'row', padding: 2}}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={{
              color: '#ffff',
              alignSelf: 'center',
              marginLeft: 20,
              fontSize: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Entypo
                name="location"
                size={15}
                color={'#ffff'}
                style={{
                  alignContent: 'center',
                  alignSelf: 'center',
                  color: '#ffff',
                }}
              />
              <Text
                style={{
                  color: '#ffff',
                  alignSelf: 'center',
                  marginLeft: 10,
                  fontSize: 12,
                }}>
                {selected_farm_location}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{flex: 5.5, flexDirection: 'row-reverse'}}
            onPress={() => logout()}>
            <MaterialCommunityIcons
              name="logout"
              size={25}
              color={'#ffff'}
              style={{
                alignContent: 'center',
                alignSelf: 'center',
                color: '#ffff',
                padding: 10,
              }}
            />
            <Text
              style={{
                alignContent: 'center',
                alignSelf: 'center',
                color: '#ffff',
              }}
              onPress={() => logout()}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Text>{user}</Text> */}
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{alignContent: 'center', margin: 2}}
            data={menu_list}
            renderItem={({item}) => (
              <RowItem
                navigation={navigation}
                title={item.name}
                allow_navigation={allow_navigation}
                id={item.id}
                branch_id={selected_farm_location_id}
                company_code={company_code}
                company_id={company_id}
                user_id={user_id}
                allow_delete_mf={allow_delete_mf}
                setpc_modalVisible={setpc_modalVisible}
                setrf_modalVisible={setrf_modalVisible}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={FlatListItemSeparator}
          />
        </View>
        {/* {content} */}
      </View>
    </View>
  );
}

function RowItem({
  navigation,
  title,
  id,
  allow_navigation,
  branch_id,
  company_code,
  company_id,
  user_id,
  setpc_modalVisible,
  setrf_modalVisible,
  allow_delete_mf,
}) {
  return (
    <TouchableOpacity
      onPress={() =>
        getContent(
          navigation,
          title,
          id,
          allow_navigation,
          branch_id,
          company_code,
          company_id,
          user_id,
          setpc_modalVisible,
          setrf_modalVisible,
          allow_delete_mf,
        )
      }>
      <View style={styles.item}>
        <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <MaterialIcons
          style={{alignSelf: 'center'}}
          name="keyboard-arrow-right"
          size={25}
          color={'#4ABBE5'}
        />
      </View>
    </TouchableOpacity>
  );
}

function RowItem_modal({branch_id, branch_name, onSelect}) {
  return (
    <TouchableOpacity onPress={() => onSelect(branch_name, branch_id)}>
      <View style={styles.item_modal}>
        <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
          <Text>{branch_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getContent(
  navigation,
  name,
  id,
  allow_navigation,
  branch_id,
  company_code,
  company_id,
  user_id,
  setpc_modalVisible,
  setrf_modalVisible,
  allow_delete_mf,
) {
  if (allow_navigation) {
    if (id == 1) {
      // load Abort
      navigation.navigate('Deliveries', {
        branch_id: branch_id,
        company_code,
        company_id,
        user_id,
        allow_delete_mf,
      });
    } else if (id == 2) {
      // Alert.alert('Under Development');
      // load Petty Cash
      setpc_modalVisible(true);
    } else if (id == 3) {
      // Alert.alert('Under Development');
      // load Petty Cash
      setrf_modalVisible(true);
    } else if (id == 4) {
      navigation.navigate('Receiving Stocks', {
        branch_id: branch_id,
        company_code,
        company_id,
        user_id,
        allow_delete_mf,
      });
    } else if (id == 5) {
      navigation.navigate('Purchase Order', {
        branch_id: branch_id,
        company_code,
        company_id,
        user_id,
        allow_delete_mf,
      });
    } else if (id == 6) {
      navigation.navigate('Consumables', {
        branch_id: branch_id,
        company_code,
        company_id,
        user_id,
        allow_delete_mf,
      });
    }else {
    }
  } else {
    Alert.alert('Please Select Farm Location');
  }
}

const styles = StyleSheet.create({
  item_modal: {
    paddingLeft: 10,
    backgroundColor: '#ffff',
    padding: 18,
    alignContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  main: {
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flex: 6,
    backgroundColor: '#ffff',
    alignContent: 'center',
    flexDirection: 'column',
  },

  header: {
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row-reverse',
    padding: 2,
    flex: 0.6,
    backgroundColor: '#4ABBE5',
    alignContent: 'center',
  },
  body: {
    flex: 5.4,
    backgroundColor: '#DADCDC',
    alignContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    marginTop: 5,
  },

  item: {
    flexDirection: 'row',
    paddingLeft: 10,
    backgroundColor: '#ffff',
    padding: 5,
    alignContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#4A4A4A',
    padding: 15,
    fontSize: 20,
  },
  main_modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 10,
  },
  modal_centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  rounded_btn: {
    flex: 0.8,
    alignContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 8,
  },
});
