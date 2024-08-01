import axiosInstance from '@/utils/request/axios.ts'
import type { LoginModel, LoginResponse } from './models/loginModel'
import { useElMessage, MessageType } from '@/hooks/useMessage';
import { ResultCode } from '../models/ResultCode'

// 登录
enum Api {
    USER_LOGIN = '/saber/login',
}

export async function Login(data: LoginModel): Promise<string | undefined> {
    try {
        const res: LoginResponse = await axiosInstance({
            url: Api.USER_LOGIN,
            method: 'POST',
            data
        })
        if (res?.result_code === ResultCode.SUCCESS) {
            useElMessage(res.message, MessageType.SUCCESS)
            const { username, token } = res.data;
            localStorage.setItem('access_token', token);
            localStorage.setItem('username', username);
            return username;
        } else {
            useElMessage(res?.message, MessageType.ERROR)
            removeInfo()
            return undefined;
        }
    } catch (error) {
        console.error('Login error:', error);
        useElMessage(error as string, MessageType.ERROR)
        removeInfo()
        return undefined;
    }
}

const removeInfo = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
}