import React, { useState } from 'react';
import {
    View,
    Flex,
    Text,
    IconButton,
    Heading,
    Input,
} from 'native-base';
//https://www.npmjs.com/package/react-native-calendars
import { Calendar } from 'react-native-calendars';
import List from './list';
import {
    FontAwesome5,
    FontAwesome,
    Ionicons,
    Feather,
} from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function CalendarView(props) {
    const { navigation } = props;

    const { t } = useTranslation();

    const [markedDates, setMarkedDays] = useState({});
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [actualSearch, setActualSearch] = useState('');

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: (props) => (
                <Heading variant="main">
                    {showCalendar
                        ? t('calendar')
                        : t('list')}
                </Heading>
            ),
            headerRight: () => (
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <IconButton
                        onPress={() => {
                            setMarkedDays({});
                            setShowCalendar(!showCalendar);
                        }}
                        variant="ghost"
                        _icon={
                            showCalendar
                                ? {
                                      as: FontAwesome5,
                                      name: 'list-ul',
                                      color: 'white',
                                  }
                                : {
                                      as: FontAwesome5,
                                      name: 'calendar-alt',
                                      color: 'white',
                                  }
                        }
                    />
                    <IconButton
                        onPress={() =>
                            setShowSearch(!showSearch)
                        }
                        variant="ghost"
                        pr="5"
                        _icon={{
                            as: FontAwesome,
                            name: 'search',
                            color: 'white',
                        }}
                    />
                </View>
            ),
        });
    }, [navigation, showSearch, showCalendar]);

    return (
        <View>
            {showSearch && (
                <Flex
                    direction="row"
                    justify="space-between"
                    bgColor="#0078d4"
                    p="2"
                >
                    <IconButton
                        onPress={() => setShowSearch(false)}
                        variant="ghost"
                        _icon={{
                            as: Ionicons,
                            name: 'arrow-back',
                            color: 'white',
                        }}
                    />
                    <Input
                        width="60%"
                        type="text"
                        value={search}
                        onChangeText={(text) => {
                            setSearch(text);
                        }}
                    />
                    <IconButton
                        onPress={() => {
                            setSearch('');
                            setActualSearch('');
                        }}
                        variant="ghost"
                        _icon={{
                            as: Feather,
                            name: 'x',
                            color: 'white',
                        }}
                    />
                    <IconButton
                        onPress={() =>
                            setActualSearch(search)
                        }
                        variant="ghost"
                        _icon={{
                            as: FontAwesome,
                            name: 'check-circle',
                            color: 'white',
                        }}
                    />
                </Flex>
            )}

            {showCalendar && (
                <Calendar
                    markedDates={markedDates}
                    onDayPress={(day) => {
                        // Handler which gets executed on day press. Default = undefined
                        //  console.log('selected day', day);
                        let newMarkedDates = {};
                        newMarkedDates[day.dateString] = {
                            selected: true,
                            marked: true,
                            selectedColor: '#dae5ee',
                            unix: day.timestamp,
                        };

                        setMarkedDays(newMarkedDates);
                    }}
                    onDayLongPress={(day) => {
                        // Handler which gets executed on day long press. Default = undefined
                        // console.log('selected day', day);
                    }}
                    monthFormat={'MMMM yyyy'}
                    onMonthChange={(month) => {
                        // Handler which gets executed when visible month changes in calendar. Default = undefined
                        // console.log('month changed', month);
                    }}
                    firstDay={1}
                    showWeekNumbers={true}
                    onPressArrowLeft={(subtractMonth) => {
                        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                        subtractMonth();
                    }}
                    onPressArrowRight={(addMonth) => {
                        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                        addMonth();
                    }}
                    enableSwipeMonths={true}
                />
            )}

            <List
                {...props}
                showCalendar={showCalendar}
                markedDate={
                    Object.keys(markedDates).length === 0
                        ? null
                        : markedDates[
                              Object.keys(markedDates)
                          ].unix
                }
                search={actualSearch}
            />
        </View>
    );
}
