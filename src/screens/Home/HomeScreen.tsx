import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { colors, fonts, sizes } from "@/theme";
import profile from '@assets/images/profile.png'
import woman from '@assets/images/woman2.png'
import job from '@assets/images/job.png'
import Card from '@/components/Card/Card'
import Container from "@/components/Container";
import RootNavigation from "@/route/RootNavigation";


const jobs = [1, 2, 3, 4, 5]

export const Home = () => {
    const home = homeStyle
    return (
        <Container>
            <View style={home.container}>
                <View style={{ position: 'absolute', right: 25, marginTop: '5%' }}>
                    <View style={{ height: 45, width: 45, borderRadius: 50, position: 'relative' }}>
                        <Image style={{ height: 45, width: 45 }} source={profile} />
                    </View>
                </View>
                <View>
                    <Text style={home.home_text_1}>Hello {"\n"}Orlando Diggs.</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={home.home_text_3}>Find Your Job</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <View style={{ display: 'flex', gap: 10, flexDirection: 'row', height: 200 }}>
                            {/* Remote job button */}
                            <TouchableOpacity onPress={() => {
                                // RootNavigation.navigate('MainSearch') 
                            }}
                                activeOpacity={0.8}
                                style={{ flex: 1, backgroundColor: colors.sega, marginRight: 10, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Image source={job} style={{ height: 40, width: 40, marginBottom: 10 }} />
                                <Text style={home.home_text_3}>44.5K</Text>
                                <Text style={home.home_text_4}>Remote Job</Text>
                            </TouchableOpacity >

                            <View style={{ flex: 1, marginLeft: 10, borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
                                {/* FUll time button */}
                                <TouchableOpacity onPress={
                                    () => {
                                        // RootNavigation.navigate('MainSearch') 
                                    }}
                                    activeOpacity={0.8}
                                    style={{ height: '45%', backgroundColor: colors.tertiary_deep, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Text style={home.home_text_3}>66.8K</Text>
                                    <Text style={home.home_text_4}>Full Time</Text>
                                </TouchableOpacity>

                                {/* Part time button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        // RootNavigation.navigate('MainSearch') 
                                    }}
                                    activeOpacity={0.8}
                                    style={{ height: '45%', backgroundColor: colors.ultra_light, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Text style={home.home_text_3}>38.9K</Text>
                                    <Text style={home.home_text_4}>Part Time</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>


                    <View style={{ marginTop: 20 }}>
                        <Text style={home.home_text_3}>Recent Job List</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        {jobs.map((item, i) => {
                            return (<View key={i} style={{ marginTop: 5, marginBottom: 5 }}>
                                <Card
                                    name="Product Design"
                                    address="Carlifonia, USA"
                                    salary="$15k"
                                    onPress={() => { RootNavigation.navigate('Description2') }}
                                />
                            </View>)
                        })}
                    </View>
                </ScrollView>
            </View>
        </Container>
    )
}

export default Home;


const homeStyle = StyleSheet.create({
    container: {
        backgroundColor: colors.background_2,
        display: 'flex',
        position: 'relative',
        height: '100%',
        paddingTop: '10%',
        paddingLeft: 25,
        paddingRight: 25
    },
    home_text_1: {
        fontFamily: fonts.dMSans.bold,
        fontSize: sizes.h22,
        color: colors.primary,
    },
    home_text_2: {
        fontFamily: fonts.dMSans.regular,
        fontSize: sizes.h18,
        color: "white"
    },
    home_banner: {
        height: 160,
        backgroundColor: colors.primary,
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        padding: 20
    },
    home_banner_button: {
        height: 35,
        width: 120,
        backgroundColor: colors.ultra,
        marginTop: 15, borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    home_banner_button_text: {
        fontFamily: fonts.dMSans.semiBold,
        fontSize: sizes.h13,
        color: 'white'
    },
    home_text_3: {
        fontSize: sizes.h16,
        fontFamily: fonts.dMSans.bold,
        color: colors.primary
    },
    home_text_4: {
        fontSize: sizes.h14,
        fontFamily: fonts.dMSans.regular,
        color: colors.primary
    }
})