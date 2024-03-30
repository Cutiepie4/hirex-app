import React from 'react';
import { Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import COLORS from '../constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    color?: string;
    filled?: boolean;
    style?: StyleProp<ViewStyle>;
}

const Button = (props: ButtonProps) => {
    const filledBgColor = props.color || COLORS.grey;
    const outlinedColor = COLORS.white;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? COLORS.white : COLORS.primary;

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...(props.style as object),
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: 16, ...({ color: textColor } as object) }}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingBottom: 10,
        paddingVertical: 6,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Button;