import axios from 'react-native-axios';
import { REST_URL } from '../configs/restAPI';

//refreshne access a refresh token
export default async function refreshToken() {
    console.log('refresh token');
    return axios.request({
        url: `${REST_URL}/refresh_token`,
        method: 'post',
        withCredentials: true,
    });
}
