import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Modal, Button, SafeAreaView, Animated, I18nManager } from 'react-native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import { GestureHandlerRootView, RectButton, Swipeable } from 'react-native-gesture-handler';
import { Ionicons, EvilIcons, AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import ItemsDetail from '../components/ItemsDetail';
import scheduleService from '../services/ScheduleService';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '@/redux/slice/authSlice';
import { RootReducer } from '@/redux/store/reducer';

export type ExtendedAgendaEntry = AgendaEntry & {
    id: number,
    notes: string,
    start: string;
    end: string;
    title: string;
    type: string;
    notification: string;
    type_notif: string;
    work_id: number,
    totalReason: number,
    nameEmployees: [];
};
const generateRandomId = () => `newId_${Math.random().toString(36).substring(2, 9)}`;

const AgendaScreen: React.FC = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState<AgendaSchedule | undefined>(undefined);
    const [showItemsDetail, setShowItemsDetail] = useState<boolean>(false);
    const [dayPick, setDayPick] = useState<any>(moment().format('YYYY-MM-DD'));
    const [isNew, setIsNew] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [reservationPick, setReservationPick] = useState<ExtendedAgendaEntry>(undefined);
    const [submit, setSubmit] = useState<boolean>(true);
    const { phoneNumber, role } = useSelector((state: RootReducer) => state.authReducer);
    const [markDate, setMarkDate] = useState({});
    console.log(reservationPick)
    const handleAddOrUpdateItem = async () => {
        try {
            setShowItemsDetail(false);
            dispatch(showLoading());
            const dayItems = items[dayPick] ? [...items[dayPick]] : [];
            const item = {
                date: reservationPick.day,
                itemsDTO: {
                    startTime: reservationPick.start,
                    endTime: reservationPick.end,
                    title: reservationPick.title,
                    type: reservationPick.type,
                    notes: reservationPick.notes,
                    notification: reservationPick.notification,
                    type_notif: reservationPick.type_notif,
                },
            };

            let response;
            if (isNew) {
                response = await scheduleService.addItem(phoneNumber, item);
                // console.log(response)
                if (response.status == 200 && response.data) {
                    console.log('1')
                    console.log(response.data)
                    dayItems.push({ ...reservationPick, id: response.data.id } as AgendaEntry);
                    Toast.show({
                        type: 'success',
                        props: {
                            title: 'Thành công',
                            content: 'Thêm sự kiện thành công',
                        },
                    });
                }
            } else {
                response = await scheduleService.updateItem(reservationPick.id, item);

                updateDayItems(dayItems, response.data);
                // console.log(dayItems)
                Toast.show({
                    type: 'success',
                    props: {
                        title: 'Thành công',
                        content: 'Cập nhật sự kiện thành công',
                    },
                });
            }
            setItems(prevItems => ({ ...prevItems, [dayPick]: dayItems }));
        } catch (error) {
            console.log(error.message)
            if (error.response) {
                const errorMessage = error.response.data;
                Toast.show({
                    type: 'error',
                    props: {
                        title: 'Lỗi',
                        content: errorMessage,
                    },
                });
            } else {
                Toast.show({
                    type: 'error',
                    props: {
                        title: 'Lỗi',
                        content: 'Lỗi không xác định. Vui lòng thử lại.',
                    },
                });
            }
        } finally {
            setSubmit(true);
            dispatch(hideLoading());
        }
    };


    const updateDayItems = (dayItems, reservationPick) => {
        const itemIndex = dayItems.findIndex(item => item.id === reservationPick.id);
        if (itemIndex > -1) {
            console.log('2')
            console.log(reservationPick)
            dayItems[itemIndex] = reservationPick;
        }
    };

    // xóa sự kiện
    const handleDeleteItem = useCallback(async (reservation: ExtendedAgendaEntry) => {
        try {
            const response = await scheduleService.deleteItem(reservation.id);
            console.log('Item deleted:', response.data);

            setItems(prevItems => {
                const updatedItems = { ...prevItems };
                if (updatedItems[reservation.day]) {
                    updatedItems[reservation.day] = updatedItems[reservation.day].filter(item => item.name !== reservation.name);
                }
                return updatedItems;
            });

        } catch (error) {
            Toast.show({
                type: 'error',
                props: {
                    title: 'Lỗi',
                    content: 'Lỗi không thể xóa',
                },
            });
        }
    }, []);
    const convertToMoment = (timeArray: number[]): string => {
        const [hour, minute] = timeArray;
        return moment({ hour, minute }).format('HH:mm');
    };
    // Lấy danh sách sự kiện
    const fetchItems = async (date) => {
        try {
            const response = await scheduleService.fetchItemsByUser(phoneNumber, moment(date).startOf('month').format('YYYY-MM-DD'), moment(date).endOf('month').format('YYYY-MM-DD'));
            const newItems = {};

            for (const item of response.data) {
                const dateStr = item.date;
                newItems[dateStr] = (item.itemsDTO || []).map(subItem => ({
                    id: subItem.id.toString(),
                    name: subItem.id.toString(),
                    notes: subItem.notes,
                    day: dateStr,
                    start: moment(subItem.startTime, 'HH:mm:ss').format('HH:mm'),
                    end: moment(subItem.endTime, 'HH:mm:ss').format('HH:mm'),
                    title: subItem.title,
                    type: subItem.type,
                    notification: subItem.notification,
                    type_notif: subItem.type_notif,
                    work_id: subItem.work_id,
                    total_reason: subItem.totalReason,
                    nameEmployee: subItem.nameEmployees,
                }));
            }

            setItems(prevItems => ({
                ...prevItems,
                ...newItems
            }));
        } catch (error) {
            Toast.show({
                type: 'error',
                props: {
                    title: 'Lỗi',
                    content: 'Lỗi không thể lấy danh sách sự kiện',
                },
            });
        }
    };

    //Lấy danh sách đánh dấu ngày
    const fetchMarkDate = async () => {
        try {
            const response = await scheduleService.fetchMarkDate(phoneNumber);
            const newMark = {};

            for (const mark of response.data) {
                newMark[mark.date] = { 'marked': true };
            }

            setMarkDate(newMark)
        } catch (error) {
            Toast.show({
                type: 'error',
                props: {
                    title: 'Lỗi',
                    content: 'Lỗi',
                },
            });
        }
    };

    useEffect(() => {
        fetchItems(dayPick);
        fetchMarkDate();
    }, []);
    const handleSetValue = useCallback((isShow: boolean, isNew: boolean, day: string, reservation: ExtendedAgendaEntry) => {
        setReservationPick({ ...reservation })
        setDayPick(day)
        setShowItemsDetail(isShow);
        setIsNew(isNew)
    }, [items, setItems]);

    // Hàm render ra sự kiện
    const renderItem = useCallback((reservation: ExtendedAgendaEntry, isFirst: boolean) => {
        const height = new Animated.Value(70)
        const animatedDelete = () => {
            Animated.timing(height, {
                toValue: 0,
                duration: 350,
                useNativeDriver: false
            }).start()
        }
        const renderRightActions = (progress, dragX) => {
            const translateX = dragX.interpolate({
                inputRange: [-64, 0],
                outputRange: [0, 64],
                extrapolate: 'clamp',
            });
            return (
                <View
                    style={{
                        width: 64,
                        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                    }}>
                    <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
                        <RectButton
                            style={[styles.rightAction, { backgroundColor: 'red' }]}
                            onPress={() => handleDeleteItem(reservation)}>
                            {/* <Ionicons name="trash-outline" size={30} color="white" /> */}
                            <Animated.View style={[styles.actionIcon,]} >
                                <Ionicons name="trash-outline" size={30} color="white" />
                            </Animated.View>
                        </RectButton>
                    </Animated.View>
                </View>
            );
        };

        return (
            <Swipeable
                friction={2}
                enableTrackpadTwoFingerGesture
                leftThreshold={30}
                rightThreshold={40}
                renderRightActions={renderRightActions}
                overshootRight={false}
                onSwipeableOpen={animatedDelete}>
                <View>
                    <TouchableOpacity
                        style={[styles.item]}
                        onPress={() => handleSetValue(true, false, reservation.day, reservation)}
                    // onPress={() => navigation.navigate('EmployeeList')}
                    >
                        <View style={styles.textContainer}>
                            <Text style={[styles.timeText]}>
                                {reservation.start} - {reservation.end}
                            </Text>
                            <Text style={[styles.titleText]}>
                                {reservation.title}
                            </Text>
                            <Text style={[styles.nameText]}>
                                {reservation.notes}
                            </Text>
                        </View>
                        <View style={styles.coloredBar} />
                        <View>
                            {/* {reservation.)} */}
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                            }}
                        >
                            <Text style={{
                                // fontFamily: 'mon',
                                color: reservation.type === 'personal' ? '#a45eff' : '#00c94d',
                                backgroundColor: reservation.type === 'personal' ? 'rgba(128,128,128,0.1)' : 'rgba(128,128,128,0.1)',
                                padding: 5,
                            }}>
                                {reservation.type}
                            </Text>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                            }}
                        >
                            {
                                reservation.type_notif === 'Không có' ?
                                    (<Ionicons name="notifications-off-outline" size={24} color="black" />) :
                                    (<Ionicons name="notifications-outline" size={24} color="black" />)
                            }
                        </View>
                    </TouchableOpacity>

                </View>
            </Swipeable>
        );
    }, [items, reservationPick]);
    console.log(items)
    const loadItems = (month) => {
        console.log(month)
    };
    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    };

    const renderDay = (day) => {
        if (day) {
            return <Text style={styles.customDay}>{day.getDay()}</Text>;
        }
        return <View style={styles.dayItem} />;
    };

    const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1.name === r2.name;
    };


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <Agenda
                    items={items}
                    // loadItemsForMonth={loadItems}
                    renderItem={renderItem}
                    renderEmptyDate={renderEmptyDate}
                    // rowHasChanged={rowHasChanged}
                    showClosingKnob={true}
                    // minDate={moment().startOf('month').format('YYYY-MM-DD')}
                    // maxDate={moment().endOf('month').format('YYYY-MM-DD')}
                    onRefresh={() => {
                        console.log('refresh')
                        fetchItems(dayPick)
                    }}
                    onDayChange={day => {
                        setDayPick(day.dateString);
                    }}
                    onDayPress={day => {
                        const selectedMonth = moment(day.dateString).format('YYYY-MM');
                        const currentMonth = moment(dayPick).format('YYYY-MM');
                        if (selectedMonth !== currentMonth) {
                            fetchItems(day.dateString);
                        }
                        setDayPick(day.dateString);
                    }}
                    refreshing={false}
                    // renderDay={renderDay}
                    markedDates={markDate}
                />

                <TouchableOpacity
                    style={styles.viewTask}
                    onPress={() => handleSetValue(true, true, dayPick, {
                        id: -1,
                        notes: '',
                        name: generateRandomId(),
                        height: Math.max(50, Math.floor(Math.random() * 150)),
                        day: dayPick,
                        start: '08:00',
                        end: '10:00',
                        title: '',
                        type: 'personal',
                        notification: '',
                        type_notif: 'Không có',
                        work_id: -1,
                        totalReason: 0,
                        nameEmployees: [],
                    })}
                >
                    <Ionicons name="add-circle-outline" size={60} color="#50C7C7" />
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showItemsDetail}
                >
                    <View style={styles.modalContainer} >
                        <View style={styles.modalContent}>
                            <ItemsDetail
                                reservationPick={reservationPick}
                                setReservationPick={setReservationPick}
                                isNew={isNew}
                                dayPick={dayPick}
                                items={items}
                                setItems={setItems}
                                setRefreshing={setRefreshing}
                                setIsShow={setShowItemsDetail}
                                setSubmit={setSubmit}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setShowItemsDetail(false);
                                    setSubmit(true);
                                }}
                                style={styles.closeButton}
                            >
                                <EvilIcons name="close-o" size={30} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleAddOrUpdateItem()} style={styles.saveButton} disabled={submit}>
                                <Text
                                    style={{
                                        color: submit ? '#999999' : '#2c7cf5',
                                        fontSize: 19,
                                        fontWeight: '600'
                                    }}
                                >Save</Text>
                            </TouchableOpacity>
                            <Text style={{
                                position: 'absolute',
                                top: 10,
                                left: '30%',
                                fontSize: 16,
                                // fontFamily: 'mon-m',
                            }}>
                                {dayPick}
                            </Text>
                        </View>
                    </View>
                </Modal>
                {/* <ModalItems
          reservationPick={reservationPick}
          setReservationPick={setReservationPick}
          isNew={isNew}
          isShow={showItemsDetail}
          setIsShow={setShowItemsDetail}
          dayPick={dayPick}
          items={items}
          setItems={setItems}
          setRefreshing={setRefreshing}
        /> */}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 10,
        padding: 10,
        // marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    customDay: {
        margin: 10,
        fontSize: 24,
        color: 'green'
    },
    dayItem: {
        marginLeft: 34
    },
    viewTask: {
        position: 'absolute',
        bottom: 40,
        right: 17,
        height: 60,
        width: 60,
        // backgroundColor: '#2E66E7',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    },
    textContainer: {
        flex: 1,
    },
    timeText: {
        fontSize: 16,
        // fontFamily: 'mon-b',
        marginBottom: 5,
    },
    titleText: {
        fontSize: 16,
        // fontFamily: 'mon-sb',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    nameText: {
        fontSize: 14,
        // fontFamily: 'mon',
        // fontStyle: 'italic',
    },
    coloredBar: {
        position: 'absolute',
        height: '100%',
        width: 5,
        backgroundColor: '#50C7C7',
        borderRadius: 5,
        right: 0,
        top: 10,
        alignSelf: 'stretch',
    },
    deleteAction: {
        backgroundColor: 'red',
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginTop: 17,
        borderRadius: 10,
    },
    actionIcon: {
        // width: 30,
        marginHorizontal: 10,
        // backgroundColor: 'plum',
        // height: 30,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderRadius: 10,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    saveButton: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
});

export default React.memo(AgendaScreen);
