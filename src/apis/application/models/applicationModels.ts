export interface GetAppListModel {
    page_no?:number
    page_size?:number
}

export interface AddAppModel {
    app_id:string
    description:string
}

export interface UpdateAppModel {
    app_id:string
    description:string
}