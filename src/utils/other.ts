import { checkType } from '../modules/utils';

/**
 * https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1
 * 深拷贝注意事项
 * 1. 循环引用（开辟存储空间WeakMap，来存储当前对象和拷贝对象的对应关系，当拷贝对象时，先去存储空间找，如果有则直接返回，否者添加到存储空间）
 * 2. 递归爆栈（递归转循环）
 * 3. 保留引用
 */
export function cloneOther(obj: any, hash = new WeakMap()) {
  // typeof 为 非'object'(包含null、undefined、boolean、number、string、bigint、symbol、function)
  const objType: any = typeof obj;
  if(objType !== 'object' || obj === null) {
    // bigInt
    if(objType === 'bigint') {
      return BigInt(obj);
    }
    // null、undefined、boolean、number
    return obj;
  }

  let Constructor = obj.constructor;
  let newObj: any;
  // 对象
  if (checkType(obj) === 'Object') {
    newObj = new Constructor();
    // 自身的所有属性
    Reflect.ownKeys(obj).reduce((acc, item, index) => {
      acc[item] = cloneOther(obj[item]);
      return acc;
    }, newObj);
  }
  // 数组
  if(checkType(obj) === 'Array') {
    newObj = new Constructor();
    obj.forEach((item: any, index: number) => {
      newObj[index] = cloneOther(item);
    });
  }
  // 正则
  if(checkType(obj) === 'RegExp') {
    let newRegExp = new Constructor(obj.source, obj.flags);
    newRegExp.lastIndex = obj.lastIndex;
    return newRegExp;
  }
  // 日期
  if(checkType(obj) === 'Date') {
    return  new Constructor(obj);
  }
  // Map
  if(checkType(obj) === 'Map') {
    return  new Constructor();
  }
  return newObj;
  // typeof 为(Arary、Object、Date、RegExp、Map、Set)

}