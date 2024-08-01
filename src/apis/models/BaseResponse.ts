import type { ResultCode } from "./ResultCode";

export interface BaseRes {
    result_code: ResultCode
    trace_id: number
    server_time: Date
    message?:string
    data: object | null
}

export interface GetBaseListResponse {
    page_no:number
    page_size:number
    pages:number
    total:number
    result_list:any[]
}

export interface QueryUserGroupResopnse {
    id: number
    name:string
    description:string
    create_by:string
    create_time:string
}