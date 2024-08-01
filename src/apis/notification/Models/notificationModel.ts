export interface GetNotificationListModel {
    page_no:number
    page_size:number
}

export interface SendNotificationModel {
    code: string,
    uid_list: number[],
    extra_data: {},
    params: {}
}