import { StyleSheet, View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Button from '../components/Button';
import RootNavigation from '../route/RootNavigation'
import Input from '../components/Input';


const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isRetryPasswordShown, setIsRetryPasswordShown] = useState(true);

    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [retryPassword, setRetryPassword] = useState('');


    const handleSigupPress = () => {
        RootNavigation.navigate('ChooseRole', {
            password: password,
            phoneNumber: phoneNumber,
            retryPassword: retryPassword,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <TouchableOpacity onPress={() => RootNavigation.pop()}>
                        <Ionicons name="arrow-back" size={24} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        textAlign: 'center',
                        color: COLORS.black
                    }}>
                        Tạo tài khoản
                    </Text>

                    {/* <Text style={{
                            fontSize: 16,
                            color: COLORS.black
                        }}> Fill your details or continue with social media</Text> */}
                </View>

                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 16, color: COLORS.black, marginBottom: 8, fontWeight: '900' }}>
                        Số điện thoại
                    </Text>
                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <Input placeholder="Số điện thoại" value={phoneNumber} onChangeText={setPhoneNumber} />

                    </View>
                </View>

                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 16, color: COLORS.black, fontWeight: 'bold', marginBottom: 8 }}>
                        Mật khẩu
                    </Text>
                    <View style={{
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <Input placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry={isPasswordShown} />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{ position: 'absolute', right: 12 }}
                        >
                            {isPasswordShown ? (
                                <Ionicons name="eye-off" size={24} color={COLORS.black} />
                            ) : (
                                <Ionicons name="eye" size={24} color={COLORS.black} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 16, color: COLORS.black, fontWeight: 'bold', marginBottom: 8 }}>
                        Nhập lại mật khẩu
                    </Text>
                    <View style={styles.inputContainer}>
<<<<<<< HEAD
                        <Input placeholder="Nhập lại mật khẩu" value={retryPassword} onChangeText={setRetryPassword} secureTextEntry={isRetryPasswordShown} />
                        <TouchableOpacity
                            onPress={() => setIsRetryPasswordShown(!isRetryPasswordShown)}
                            style={{ position: 'absolute', right: 12 }}
                        >
                            {isRetryPasswordShown ? (
                                <Ionicons name="eye-off" size={24} color={COLORS.black} />
                            ) : (
                                <Ionicons name="eye" size={24} color={COLORS.black} />
                            )}
                        </TouchableOpacity>
=======
                        <TextInput
                            style={styles.input}
                            placeholder="Retype Password"
                            onChangeText={setRetryPassword}
                            value={retryPassword}
                        />
>>>>>>> fd096d922d062ad363ad51d4259bbb2bca753ce7
                    </View>
                </View>

                <Button
                    title="Đăng ký"
                    filled
                    onPress={handleSigupPress}
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                        height: 52,
                        width: 250,
                        alignSelf: 'center'
                    }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={() => console.log('Pressed')}
                        style={{
                            marginTop: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            width: 250,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10,
                            backgroundColor: COLORS.lavendar,
                            alignSelf: 'center'
                        }}
                    >
                        <Image
                            source={require('../assets/google.png')}
                            style={{ height: 30, width: 30, marginRight: 8 }}
                            resizeMode="contain"
                        />
                        <Text style={{ fontSize: 15, fontWeight: '900', marginVertical: 12, color: COLORS.black }}>SIGN IN WITH GOOGLE</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Bạn có sẵn sàng để tạo một tài khoản ?</Text>
                    <Pressable
                        onPress={() => RootNavigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: '#FF9228',
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Đăng nhập</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        paddingLeft: 15,
        paddingRight: 15,
    },
    label: {
        fontSize: 16,
        color: COLORS.black,
        marginBottom: 8,
        fontWeight: '900'
    },
    inputContainer: {
        width: '100%',
        height: 48,
        borderColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 22
    },
    input: {
        width: '100%'
    }
});
export default Signup