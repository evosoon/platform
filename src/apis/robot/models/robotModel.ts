export interface GetRobotListModel {
    k?:string 
    page_no?:number
    page_size?:number
}

export interface UpdateRobotModel {
    name: string
    description: string
}