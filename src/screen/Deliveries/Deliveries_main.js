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
  Button,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SearchBar} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker2 from '@react-native-community/datetimepicker';
import ImageViewer from 'react-native-image-zoom-viewer';

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

export default function Deliveries_main({
  navigation: {goBack},
  navigation,
  route,
}) {
  //global params for instant loading
  const {company_id, branch_id, company_code, user_id} = route.params;
  const module = 'DR'; // module
  const [image_data_loaded, setimage_data_loaded] = useState(false);
  const [image_found, setimage_found] = useState(false);
  const [spinner, setSpinner] = React.useState(false);

  //trucking init

  const [trucking_status_string, setTruckingStatus_String] = useState('');
  const [trucking_status, setTruckingStatus] = useState(false);
  const [chart_id, setChartID] = useState('');
  const [img_list_trucking, setimg_list_trucking] = React.useState(null);
  const [image_found_trucking, setimage_found_trucking] = useState(false);

  //image view list
  const [imageViewList, setImageView] = useState(null);

  //select delete image functiuon
  const [find_image_index, setfind_image_index] = useState('');
  const [selected_image_id, setselected_image_id] = useState('');

  //search function
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.query_data
          ? item.query_data.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const on_generate_report = () => {
    get_deliveries_data();
  };

  //selected
  const [selected_dr_number, setselected_dr_number] = useState('');
  const [selected_dr_id, setselected_dr_id] = useState('');

  const [menu_list, setMenu_list] = React.useState(null);
  const [img_list, setimg_list] = React.useState(null);
  const [content, setcontent] = React.useState(null);

  const logout = () => {
    goBack();
    AsyncStorage.clear();
    Alert.alert('offline storage cleared');
  };

  const get_deliveries_data = () => {
    setSpinner(true);
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    formData.append('branch_id', branch_id);
    formData.append('start_date', selected_start_date);
    formData.append('end_date', selected_end_date);

    // console.log(selected_end_date + ' ' + selected_start_date);

    fetch(global.global_url + '/deliveries/get_deliveries_data.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setSpinner(false);
        var data = responseJson.array_data.map(function (item, index) {
          return {
            dr_header_id: item.dr_header_id,
            delivery_number: item.delivery_number,
            invoice_no: item.invoice_no,
            query_data:  item.delivery_number+'.'+item.invoice_no,
            tr_status: item.tr_status,
            te_id: item.te_id,
          };
        });
        setMenu_list(data);
        setFilteredDataSource(data);
        setMasterDataSource(data);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
        Alert.alert('Internet Connection Error');
      });
  };

  const get_images_data = (reference_number) => {
    setimage_data_loaded(false);
    setimg_list('');
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    formData.append('branch_id', branch_id);
    formData.append('reference_number', reference_number);
    formData.append('module', module);
    formData.append('primary_url', global.notes_web_directory);

    fetch(global.global_url + '/deliveries/get_micro_filming_img.php', {
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
            id: item.id,
            url: item.slug,
          };
        });

        if (data.length > 0) {
          setimg_list(data);
          setimage_found(true);
        } else {
          setimg_list('');
          setimage_found(false);
        }

        // trucking
        var data_trucking = responseJson.array_data_trucking.map(function (
          item,
          index,
        ) {
          return {
            url: item.slug,
          };
        });

        if (data_trucking.length > 0) {
          setimg_list_trucking(data_trucking);
          setimage_found_trucking(true);
        } else {
          setimg_list_trucking('');
          setimage_found_trucking(false);
        }

        setimage_data_loaded(true);
        //
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };

  //main modal
  const [modal_main_Visible, setmodal_main_Visible] = useState(false);

  const show_modal_main = (dr_number, dr_id, tr_status, details_id) => {
    setmodal_main_Visible(true);
    setselected_dr_number(dr_number);
    setselected_dr_id(dr_id);
    setChartID(details_id);
    setTruckingStatus_String(tr_status);

    if (tr_status == 'Yes') {
      setTruckingStatus(true);
    } else {
      setTruckingStatus(false);
    }
  };

  //modal view images
  const [modal_img_Visible, setmodal_img_Visible] = useState(false);

  //date
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [mode2, setMode2] = useState('date');

  const [show_end_date, setshow_end_date] = useState(false);

  const [show_start_date, setshow_start_date] = useState(false);

  //setup state start date
  var start_date = '';
  var start_raw_date = new Date();
  var Y = start_raw_date.getFullYear();
  var mm = '';
  var dd = '';

  if ((start_raw_date.getMonth() + 1).toString().length > 1) {
    mm = start_raw_date.getMonth() + 1;
  } else {
    mm = '0' + (start_raw_date.getMonth() + 1);
  }

  start_date = Y + '-' + mm + '-' + '01';

  //setup state end date
  var end_date = '';
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); // get last day of the month
  var e_Y = lastDay.getFullYear();
  var e_mm = '';
  var e_dd = lastDay.getDate();

  if ((lastDay.getMonth() + 1).toString().length > 1) {
    e_mm = lastDay.getMonth() + 1;
  } else {
    e_mm = '0' + (lastDay.getMonth() + 1);
  }

  end_date = e_Y + '-' + e_mm + '-' + e_dd;

  const [selected_start_date, setselected_start_date] = useState(start_date);
  const [selected_end_date, setselected_end_date] = useState(end_date);
  // const [selected_date, setselected_date] =   useState( new Date().toDateString());
  const onChange_start_date = (event, selectedDate) => {
    setshow_start_date(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
    var mdate = '';
    var Y = selectedDate.getFullYear();
    var mm = '';
    var dd = '';

    if ((selectedDate.getMonth() + 1).toString().length > 1) {
      mm = selectedDate.getMonth() + 1;
    } else {
      mm = '0' + (selectedDate.getMonth() + 1);
    }

    if (selectedDate.getDate().toString().length == 1) {
      dd = '0' + selectedDate.getDate();
    } else {
      dd = selectedDate.getDate();
    }

    mdate = Y + '-' + mm + '-' + dd;
    setselected_start_date(mdate);
  };

  const onChange_end_date = (event, selectedDate) => {
    setshow_end_date(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
    var mdate = '';
    var Y = selectedDate.getFullYear();
    var mm = '';
    var dd = '';

    if ((selectedDate.getMonth() + 1).toString().length > 1) {
      mm = selectedDate.getMonth() + 1;
    } else {
      mm = '0' + (selectedDate.getMonth() + 1);
    }

    if (selectedDate.getDate().toString().length == 1) {
      dd = '0' + selectedDate.getDate();
    } else {
      dd = selectedDate.getDate();
    }

    mdate = Y + '-' + mm + '-' + dd;
    setselected_end_date(mdate);
  };

  const showDatepicker = () => {
    setMode('date');
    setshow_start_date(true);
  };

  const showDatepicker2 = () => {
    setMode2('date');
    setshow_end_date(true);
  };

  //delete image function
  const view_image = () => {
    setmodal_img_Visible(true);
    setselected_image_id(img_list[0].id);
  };

  const delete_image = (id) => {
    setSpinner(true);
    const formData = new FormData();
    formData.append('company_code', company_code);
    formData.append('company_id', company_id);
    formData.append('branch_id', branch_id);
    formData.append('id', id);

    fetch(global.global_url + '/deliveries/delete_micro_filming.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
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
        setSpinner(false);
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };

  //main function
  useFocusEffect(
    React.useCallback(() => {
      console.log(selected_start_date);
      get_deliveries_data();
      return () => {};
    }, []),
  );

  return (
    <View style={styles.main}>
      {/* //Main modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal_main_Visible}
        backdropColor={'green'}
        backdropOpacity={1}
        onRequestClose={() => {
          setmodal_main_Visible(!modal_main_Visible);
        }}>
        <View style={styles.centeredView}>
          {image_data_loaded ? (
            <View style={styles.main_modalView}>
              <View style={{flexDirection: 'row', padding: 2}}>
                <Text
                  style={{flex: 0.8, alignSelf: 'center', textAlign: 'center'}}>
                  {selected_dr_number}
                </Text>
              </View>
              <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    setmodal_main_Visible(false);
                    navigation.navigate('Upload Deliveries', {
                      dr_number: selected_dr_number,
                      user_id: user_id,
                    });
                  }}
                  style={styles.rounded_btn}>
                  <View style={{flexDirection: 'row'}}>
                    <MCI name="image-plus" size={20} color={'black'} />
                    <Text
                      style={{
                        flex: 0.8,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                      Add Image
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    setImageView(img_list);
                    image_found
                      ? view_image()
                      : Alert.alert('No image Available');
                  }}
                  style={styles.rounded_btn}>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialIcons
                      name="image-search"
                      size={20}
                      color={'black'}
                    />
                    <Text
                      style={{
                        flex: 0.8,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                      View Image
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {trucking_status && (
                <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setmodal_main_Visible(false);
                      navigation.navigate('Upload Deliveries', {
                        dr_number: selected_dr_number,
                        user_id: user_id,
                        chart_id: chart_id,
                        trucking_status_string: trucking_status_string,
                        selected_dr_id: selected_dr_id,
                      });
                    }}
                    style={styles.rounded_btn}>
                    <View style={{flexDirection: 'row'}}>
                      <MCI name="image-plus" size={20} color={'black'} />
                      <Text
                        style={{
                          flex: 0.8,
                          alignSelf: 'center',
                          textAlign: 'center',
                        }}>
                        Trucking Add Image
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {trucking_status && (
                <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setImageView(img_list_trucking),
                        image_found_trucking
                          ? setmodal_img_Visible(true)
                          : Alert.alert('No image Available');
                    }}
                    style={styles.rounded_btn}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialIcons
                        name="image-search"
                        size={20}
                        color={'black'}
                      />
                      <Text
                        style={{
                          flex: 0.8,
                          alignSelf: 'center',
                          textAlign: 'center',
                        }}>
                        Trucking View Image
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    setmodal_main_Visible(false);
                  }}
                  style={styles.rounded_btn}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                      Close
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.main_modalView}>
              <ActivityIndicator size="small" color="#4ABBE5" />
            </View>
          )}
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
        }}>
        <View style={{flexDirection: 'row-reverse', backgroundColor: 'black'}}>
          <TouchableHighlight
            style={{...styles.openButton, backgroundColor: 'black'}}
            onPress={() => {
              setmodal_img_Visible(!modal_img_Visible);
            }}>
            <View style={{flexDirection: 'row-reverse', padding: 10}}>
              <AntDesign name="closecircleo" size={20} color={'white'} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={{...styles.openButton, backgroundColor: 'black'}}
            onPress={() => {
              //console.log(selected_image_id);
              delete_image(selected_image_id);
            }}>
            <View style={{flexDirection: 'row-reverse', padding: 10}}>
              <AntDesign name="delete" size={20} color={'white'} />
            </View>
          </TouchableHighlight>
        </View>
        <ImageViewer
          imageUrls={imageViewList}
          // loadingRender={console.log('rendering')}
          onChange={(index) => {
            setselected_image_id(imageViewList[index].id);
          }}
        />
      </Modal>
      {/* end image modal */}

      <View style={styles.header}>
        <View style={{flex: 1, flexDirection: 'row', padding: 2}}>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              goBack();
            }}>
            <View
              style={{
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
                padding: 2,
              }}>
              <AntDesign
                style={{marginRight: 10}}
                name="arrowleft"
                size={20}
                color={'black'}
              />
              <Text style={{fontSize: 20, textAlign: 'center'}}>
                Deliveries
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <View style={styles.header_date}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'column'}}>
            <SearchBar
              containerStyle={{backgroundColor: 'white'}}
              onChangeText={(text) => searchFilterFunction(text)}
              onClear={(text) => searchFilterFunction('')}
              value={search}
              placeholder="Search Here..."
              inputStyle={{color: 'black'}}
              round
              lightTheme
            />
          </View>
          <View style={{flexDirection: 'row', padding: 5}}>
            <Text style={styles.text_header}>Start Date</Text>
            {show_start_date && (
              <DateTimePicker2
                testID="dateTimePicker2"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange_start_date}
              />
            )}
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.date_picker}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{flex: 0.8, alignSelf: 'center', textAlign: 'center'}}>
                  {selected_start_date}
                </Text>
                <View
                  style={{
                    flex: 0.2,
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <FontAwesome name="calendar" size={17} color={'gray'} />
                </View>

                {/* */}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', padding: 5}}>
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
            <TouchableOpacity
              onPress={showDatepicker2}
              style={styles.date_picker}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{flex: 0.8, alignSelf: 'center', textAlign: 'center'}}>
                  {selected_end_date}
                </Text>
                <View
                  style={{
                    flex: 0.2,
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <FontAwesome name="calendar" size={17} color={'gray'} />
                </View>

                {/* */}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', padding: 5, alignSelf: 'center'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#4ABBE5',
                flex: 1,
                borderWidth: 1.5,
                borderColor: '#4ABBE5',
                borderRadius: 10,
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}
              onPress={on_generate_report}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#ffff',
                    padding: 5,

                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: 'bold',
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                  {' '}
                  <AntDesign name="sync" size={15} color={'white'} /> Generate
                  Report
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
            data={filteredDataSource}
            renderItem={({item}) => (
              <RowItem
                get_images_data={get_images_data}
                show_modal_main={show_modal_main}
                navigation={navigation}
                dr_header_id={item.dr_header_id}
                invoice_no ={item.invoice_no}
                delivery_number={item.delivery_number}
                tr_status={item.tr_status}
                te_id={item.te_id}
              />
            )}
            keyExtractor={(item) => item.dr_header_id.toString()}
            ItemSeparatorComponent={FlatListItemSeparator}
          />
        </View>
        {/* {content} */}
      </View>
      {spinner && <CustomProgressBar />}
    </View>
  );
}

const CustomProgressBar = ({visible}) => (
  <Modal onRequestClose={() => null} visible={visible} transparent={true}>
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <View style={{borderRadius: 10, backgroundColor: '#f0f0f0', padding: 15}}>
        <ActivityIndicator size="large" color="#4ABBE5" />
      </View>
    </View>
  </Modal>
);

function RowItem({
  navigation,
  delivery_number,
  dr_header_id,
  show_modal_main,
  invoice_no,
  get_images_data,
  tr_status,
  te_id,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        show_modal_main(delivery_number, dr_header_id, tr_status, te_id);
        get_images_data(delivery_number);
      }}>
      <View style={styles.item}>
        <View style={{flex: 3, alignItems: 'center'}}>
          <Text style={styles.title}>{delivery_number}</Text>
          <Text style={styles.text_inv}>INVOICE #: {invoice_no}</Text>
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
const styles = StyleSheet.create({
  rounded_btn: {
    flex: 0.8,
    alignContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 8,
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
    flexDirection: 'row',
    padding: 2,
    flex: 0.5,
    alignContent: 'center',
  },
  header_date: {
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 2,
    flex: 3,
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
    padding: 3,
    alignContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#4A4A4A',
    padding: 5,
    fontSize: 18,
    fontWeight:'bold'
  },
  text_inv: {
    color: '#4A4A4A',
    padding: 5,
    fontSize: 15,
  },
  text_header: {
    alignContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 1,
    padding: 7,
    borderColor: 'gray',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    flex: 0.3,
  },
  date_picker: {
    flex: 0.7,
    alignContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 7,
    borderColor: 'gray',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
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
});
