import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
export default function Test_main () {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
    setShow(Platform.OS === 'ios' ? true : false);
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
    console.log(mdate)


  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};
