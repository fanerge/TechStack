import LinkedList from './linkedList';

export default (function(){
  let items = new WeakMap();

  // hash函数（非常重要，必须要防止hash碰撞）
  function loseloseHashCode(key: string) {
    let array = Array.from(key);
    let hash = array.reduce((acc, item) => {
      return acc + item.codePointAt(0);
    }, 0);

    return hash % 37;
  }

  // 辅助类（ValuePair）
  class ValuePair {
    key: any;
    value: any;
    constructor(key: any, value: any) {
      this.key = key;
      this.value = value;
    }

    toString() {
      return '[' + this.key + ' - ' + this.value + ']';
    };
  }

  // 分离链接版
  return class HashTable {
    constructor() {
      items.set(this, []);
    }

    put(key: string, value: any) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      if(table[hash] === undefined) {
        table[hash] = new LinkedList();
      }
      table[hash].append(new ValuePair(key, value));
    }

    get(key: string) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      let item =  table[hash];
      // let item = new LinkedList();
      if(item !== undefined) {
        let current = item.getHead();
        while(current) {
          if(current.element.key === key) {
            return current.element.value;
          }
          current = current.next;
        }
      }
      return undefined;
    }

    delete(key: string) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      if(table[hash] !== undefined) {
        let current = table[hash].getHead();
        while(current) {
          if(current.element.key === key) {
            table[hash].remove(current.element);
            // 移除最后一项，特殊处理
            if(table[hash].isEmpty()) {
              table[hash] = undefined;
            }
            return true;
          }
          current = current.next;
        }
      }
      return false;
    }

    print() {
      let table = items.get(this);
      return table;
    }
  }
})();