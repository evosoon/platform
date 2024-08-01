export type EnumItem = {
    icon?: string
    title: string
    link?: string
    showChild?: boolean
    children?: EnumItem[]
  }
  
  export interface ScrollbarStatus {
    hasScrollbar: boolean
    atTop: boolean
    atBottom: boolean
  }

  export interface Props {
    navList: EnumItem[]
    nowRouteTitle: string
  }