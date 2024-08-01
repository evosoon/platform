export interface GetClusterModel {
    page_no?: number
    page_size?: number
}

export interface AddClusterModel {
    id: number
    chat_id: string
    name: string
}

export interface UpdateClusterModel {
    id: number
    chat_id: string
    name: string
}