import { StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import Container from '@/components/Container'
import CAT from '../../assets/ccat.jpg';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { hideIncommingCall, showIncommingCall } from '@/redux/slice/chatSlice';
import { RootReducer } from '@/redux/store/reducer';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { deepPurple, titleFontStyle } from '@/styles/styles';
import { StatusBar } from 'expo-status-bar';
import RootNavigation from '@/route/RootNavigation';
import JoinScreen from './JoinScreen';
import Toast from 'react-native-toast-message';

const IncomingCallScreen = (props) => {
    const { caller, acceptCall, refuseCall } = props;

    return (
        <>
            <View style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: deepPurple
            }}>

                <View
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        overflow: 'hidden',
                        marginTop: 150,
                        marginBottom: 20
                    }}
                >
                    <Image
                        source={CAT}
                        resizeMode='cover'
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </View>

                <View>
                    <Text style={[titleFontStyle, { color: 'white', fontSize: 20 }]}>
                        {caller}
                    </Text>
                </View>
            </View>

            <View style={{
                position: 'absolute',
                bottom: 80,
                left: 80,
                right: 80,
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <TouchableOpacity style={[styles.circle, { backgroundColor: 'green' }]} onPress={acceptCall}>
                    <Feather name="phone" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.circle]}>
                    <MaterialCommunityIcons name="phone-hangup" size={28} color="white" onPress={refuseCall} />
                </TouchableOpacity>
            </View>
        </>
    )
};

const IncomingCall = () => {
    const dispatch = useDispatch();
    const { incommingCallShow } = useSelector((state: RootReducer) => state.chatReducer);
    const [caller, setCaller] = useState('');
    const [roomId, setRoomId] = useState<String>(null);
    const [showJoinScreen, setShowJoinScreen] = useState(false);

    messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        if (remoteMessage.data.notificationType === 'videoCall') {
            dispatch(showIncommingCall());
            setCaller(remoteMessage.notification.title);
            setRoomId(remoteMessage.notification.body);
        }
        else if (remoteMessage.data.notificationType === 'schedule'){
            Toast.show({
                type: 'info',
                text1: remoteMessage.notification.title,
                text2: remoteMessage.notification.body,
            });
        }
    });

    const acceptCall = useCallback(() => {
        roomId && setShowJoinScreen(true);
    }, [roomId]);

    const refuseCall = useCallback(() => {
        dispatch(hideIncommingCall());
        setShowJoinScreen(false);
    }, []);

    return (
        <Modal visible={incommingCallShow}>
            <StatusBar backgroundColor={deepPurple} style='light' />
            {showJoinScreen
                ? <JoinScreen roomId={roomId} refuseCall={refuseCall} />
                : <IncomingCallScreen caller={caller} acceptCall={acceptCall} refuseCall={refuseCall} />}
        </Modal>
    )
};

export default IncomingCall;

const styles = StyleSheet.create({
    circle: {
        backgroundColor: 'red',
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 20
    }
})