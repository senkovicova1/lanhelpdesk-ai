import axios from 'react-native-axios';
import { REST_URL } from '../configs/restAPI';

//refreshne access a refresh token
export default async function refreshToken() {
    console.log('REST_URL', REST_URL);
    return axios.request({
        url: `${REST_URL}/refresh_token`,
        method: 'post',
        withCredentials: true,
    });
}