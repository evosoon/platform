export default function deepEqual(obj1: any, obj2: any): boolean {
    // 检查基本类型和 null 的相等性
    if (obj1 === obj2) {
      return true
    }
  
    // 检查两者是否都是对象
    if (
      typeof obj1 !== 'object' ||
      obj1 === null ||
      typeof obj2 !== 'object' ||
      obj2 === null
    ) {
      return false
    }
  
    // 检查对象属性数量是否相同
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
      return false
    }
  
    // 递归比较对象的每个属性值
    for (const key of keys1) {
      if (!deepEqual(obj1[key], obj2[key])) {
        return false
      }
    }
    return true
  }