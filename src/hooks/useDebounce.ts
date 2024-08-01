export const useDebounce = (func:any, delay:number) => {
    let timerId: number | undefined
    return (...args:any[]) => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }