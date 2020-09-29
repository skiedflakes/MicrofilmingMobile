import React, {useState} from 'react';
import {View, Button, Modal, Text, TextInput, StyleSheet, TouchableOpacity, CheckBox} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';

export default function PettycashReplenish_add_main ({navigation:{goBack},navigation,route}) {

    const { company_id,branch_id,company_code,user_id } = route.params;
    
    const [text_checkNumber, setCheckNumber] = useState('');
    const [text_remarks, setRemarks] = useState('');
    const [Tracking_num, setTracking_num] = useState('');

    const [isSelected, setSelection] = useState(false);
    const [credit, setCredit] = React.useState('');
    const [menu_list, setMenu_list] = React.useState([]);

    useFocusEffect(
    React.useCallback(() => {
        
        //alert("User_id:"+user_id+" | branch_id:"+branch_id+" | company_code:"+company_code+" | company_id:"+company_id);
        get_data();
        return () => {
        };
    }, [])
    );

    const get_data = () =>{
        //setSpinner(true)
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('company_code', company_code);
        formData.append('company_id', company_id);
        formData.append('branch_id', branch_id); 

        fetch(global.global_url+'/replinish/getPettyCashRPLNSHNum_data.php', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
            },
            body: formData
        }).then((response) => response.json())
        .then((responseJson) => {
            
            var response_data = responseJson.PFR_response[0];
            setTracking_num(response_data.PFR);

            var data = responseJson.credit_response.map(function(item,index) {
                return {
                    value:item.gchart_sub_id,
                    label: item.s_chart
                };
            });
            setMenu_list(data);

            console.log(data);

            //setSpinner(false)
        }).catch((error) => {
            console.error(error);
            //setSpinner(false)
            Alert.alert('Internet Connection Error');
        });
    }

    const saveData = () =>{
        //setSpinner(true)
        const formData = new FormData();
        formData.append('user_id', user_id); 
        formData.append('company_code', company_code);
        formData.append('company_id', company_id);
        formData.append('branch_id', branch_id); 
        formData.append('category_id', '');

        fetch(global.global_url+'/replinish/addPettycashReplenish.php', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
            },
            body: formData
        }).then((response) => response.json())
        .then((responseJson) => {
            
            var response_data = responseJson.response_status[0];

            console.log(response_data.status);

            //setSpinner(false)
        }).catch((error) => {
            console.error(error);
            //setSpinner(false)
            Alert.alert('Internet Connection Error');
        });
    }

    const getCurrentDate=()=>{
        var date = '';
        var month = '';
        var year = new Date().getFullYear();

        if((new Date().getMonth() + 1).toString().length>1){
            month = new Date().getMonth()+1; 
        }else{
            month = '0'+(new Date().getMonth()+1); 
        }

        if(new Date().getDate().toString().length==1){
            date = '0'+new Date().getDate(); 
        }else{
            date = new Date().getDate(); 
        }

        return year + '-' + month + '-' + date;
    }

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');

    const [show_date, setshow_date] = useState(false);
    const [selected_date, setselected_date] = useState(getCurrentDate());

    const onChange_date = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        setDate(currentDate);
        setshow_date(Platform.OS === 'ios' ? true : false);
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
        setshow_date(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <View>
            <View style={{flexDirection: 'row', padding:5}} >
            <Text style={styles.filter_header}>Tracking #:</Text>
            <View style={styles.filter_picker}>
                <Text style={{backgroundColor:'#DADCDC', padding:11}}>{Tracking_num}</Text>
            </View>
            </View>
            <View style={{flexDirection: 'row', padding:5}} >
            <Text style={styles.filter_header}>Date:</Text>
            <View style={styles.filter_picker}>
                {show_date && (
                            <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange_date}
                            />
                        )}
                <TouchableOpacity onPress={showDatepicker}>
                    <View style={{ flexDirection: "row",}} >
                        <Text style={{padding:11}}>{selected_date}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            </View>
            <View style={{flexDirection: 'row', padding:5}} >
            <Text style={styles.filter_header}>Remarks:</Text>
            <View style={styles.filter_picker}>
                <TextInput
                    style={{height: 40}}
                    onChangeText={text => setRemarks(text)}
                    defaultValue={text_remarks}
                    />
            </View>
            </View>
            <View style={{flexDirection: 'row', padding:5}} >
            <Text style={styles.filter_header}>Credit Method:</Text>
            <View style={styles.filter_picker}>
                <RNPickerSelect
                    placeholder={{
                        label: 'Please choose',
                        value: '',
                    }}
                    style={pickerStyle}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={(value) => setCredit(value)}
                    items={menu_list}
                />
            </View>
            </View>
            <View style={{flexDirection: 'row', padding:5}} >
            <Text style={styles.filter_header}>Check Number:</Text>
            <View style={styles.filter_picker}>
                <TextInput
                    style={{height: 40}}
                    onChangeText={text => setCheckNumber(text)}
                    defaultValue={text_checkNumber}
                    />
            </View>
            </View>
            <View style={{flexDirection: 'row', padding:5}} >
            <Text style={styles.filter_header}>Undeclared:</Text>
            <View style={styles.filter_picker}>
                <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={styles.checkbox}
                />
            </View>
            </View>
        </View>
    );
};

const pickerStyle = {
	inputIOS: {
		color: 'black',
		paddingTop: 13,
		paddingHorizontal: 10,
		paddingBottom: 12,
	},
	inputAndroid: {
    color: 'black',
    height: 40,
  },
  placeholderColor: 'black',
  underline: { borderTopWidth: 0 },
};

const styles = StyleSheet.create({
    filter_header: {
        alignContent:"center",
        alignSelf:"center",
        textAlign:"center",
        borderWidth:1,
        paddingBottom: 11,
        paddingTop: 11,
        paddingLeft: 6,
        paddingRight: 6,
        borderColor: "gray",
        borderBottomLeftRadius:8,
        borderTopLeftRadius:8,
        flex:0.3,
      },
      filter_picker:{
        flex:0.7,
        alignContent:"center",
        alignSelf:"center",
        borderWidth:1,
        borderColor: "gray",
        borderBottomRightRadius:8,
        borderTopRightRadius:8,
        height: 44
      },
      checkbox: {
        padding: 20,
      },
})

