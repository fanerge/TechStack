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

  return class HashTable {
    constructor() {
      items.set(this, []);
    }

    put(key: string, value: any) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      console.log(hash);
      table[hash] = value;
    }

    get(key: string) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      return table[hash];
    }

    delete(key: string) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      if(this.get(key) !== undefined) {
        table[hash] = undefined;
        return true;
      }
      return false;
    }

    print() {
      let table = items.get(this);
      return table;
    }
  }
})();