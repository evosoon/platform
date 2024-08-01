// 防抖
export default function debounce<T extends (...args: any[])=>any>(func: T, wait: number = 400):(...args:Parameters<T>)=>void{
    let timeout: number | undefined
    return function(this:ThisParameterType<T>, ...args: Parameters<T>){
        let context = this
        clearTimeout(timeout)
        timeout = setTimeout(()=>func.apply(context,args),wait)
    }
}