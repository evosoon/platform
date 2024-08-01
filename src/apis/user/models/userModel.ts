export interface GetUserListModel {
  d?:string
  k?:string 
  page_no?:number
  page_size?:number
}

export interface AddUserModel {
    name?: string
    department?: string
    email?: string
    mobile?: string
    user_id?: string
}

export interface UpdateUserModel {
    name: string
    department: string
    email: string
    mobile: string
    user_id: string
}