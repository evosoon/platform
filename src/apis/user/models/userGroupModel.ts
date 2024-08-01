export interface GetUserGroupListModel {
    k?: string
    page_no?: number
    page_size?: number
}

export interface AddUserGroupModel {
    name: string
    description?: string
    uid_list: number[] | []
}
export interface AddUserGroupResponse {
    create_by: string;
    create_time: string;
    description: string;
    id: number;
    name: string;
}