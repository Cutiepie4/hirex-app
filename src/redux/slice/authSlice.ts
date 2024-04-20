import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AuthState {
    phoneNumber: string,
    access_token: string,
    role: string,
    isLoading: boolean,
    showTabBar: boolean,
    deviceToken: string,
};

const initialState: AuthState = {
    phoneNumber: '',
    access_token: '',
    role: '',
    isLoading: false,
    showTabBar: false,
    deviceToken: '',
};

const authSlice = createSlice({
    name: 'authReducer',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ role: string, phoneNumber: string, access_token: string }>) => {
            const { role, phoneNumber, access_token } = action.payload;
            state.role = role;
            state.phoneNumber = phoneNumber;
            state.access_token = access_token;
        },
        logout: (state) => initialState,
        showLoading: (state) => {
            return { ...state, isLoading: true };
        },
        hideLoading: (state) => {
            return { ...state, isLoading: false };
        },
        showTabBar: (state) => {
            return { ...state, showTabBar: true };
        },
        hideTabBar: (state) => {
            return { ...state, showTabBar: false };
        },
        saveDeviceToken: (state, action) => {
            return { ...state, deviceToken: action.payload }
        }
    },
    extraReducers(builder) {

    },
});

export const { login, showLoading, hideLoading, logout, showTabBar, hideTabBar, saveDeviceToken } = authSlice.actions;
export default authSlice.reducer;