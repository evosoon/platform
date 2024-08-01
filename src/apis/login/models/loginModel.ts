export interface LoginModel {
    username: string
    password: string | number
}

export interface LoginResponse {
    message:string
    result_code: string;
    data: {
        username: string;
        token: string;
    }
}