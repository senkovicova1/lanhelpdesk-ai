import React, { useState } from 'react';
import {
  View
} from "native-base";
//https://www.npmjs.com/package/react-native-calendars
import {
  Calendar
} from 'react-native-calendars';
import List from './list';

export default function CalendarView ( props ) {
  const {
    navigation
  } = props;

  const [ markedDates, setMarkedDays ] = useState({});

  return (
    <View>

      <Calendar
        markedDates={markedDates}
        onDayPress={day => {
          // Handler which gets executed on day press. Default = undefined
        //  console.log('selected day', day);
          let newMarkedDates = {};
          newMarkedDates[day.dateString] = {selected: true, marked: true, selectedColor: '#dae5ee'};

          setMarkedDays(newMarkedDates);
        }}
        onDayLongPress={day => {
          // Handler which gets executed on day long press. Default = undefined
          console.log('selected day', day);
        }}
        monthFormat={'MMMM yyyy'}
        onMonthChange={month => {
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          console.log('month changed', month);
        }}
        firstDay={1}
        showWeekNumbers={true}
        onPressArrowLeft={(subtractMonth) => {
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          // subtractMonth()
        }}
        onPressArrowRight={(addMonth) => {
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          // addMonth()
        }}
        enableSwipeMonths={true}
      />

    <List />

    </View>
  );
}
