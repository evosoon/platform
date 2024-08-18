export const useReplacePlaceholders = (str:string,hidden:boolean=false)=>{
    if(hidden && str.length>200) return '内容过大请点击查看'
    return str
      .replace(/\$\{\s*(.*?)\s*\}/g, '<span class="special special_4">$1</span>') // 处理 ${ something }
      .replace(/\#\{\s*(.*?)\s*\}/g, '<span class="special special_2">$1</span>') // 处理 #{ something }
      .replace(/\{\s*(.*?)\s*\}/g, '<span class="special">$1</span>')             // 处理 { something }

  }