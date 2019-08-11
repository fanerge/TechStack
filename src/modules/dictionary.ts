export default (function(){
  let items = new WeakMap();

  // 只考虑string作为object的key（Symbol不考虑）
  return class Dictionary {
    constructor() {
      items.set(this, {});
    }

    has(key: any) {
      let obj = items.get(this);
      return obj[key] !== undefined;
    }

    set(key: any, value: any) {
      let obj = items.get(this);
      obj[key] = value;
    }

    delete(key: any) {
      let obj = items.get(this);
      if(this.has(key)) {
        delete obj[key];
        return true;
      }
      return false;
    }

    get(key: any) {
      let obj = items.get(this);
      return obj[key];
    }

    clear() {
      items.set(this, {});
    }

    size() {
      return Object.keys(items.get(this)).length;
    }

    keys() {
      let obj = items.get(this);
      return Object.keys(obj);
    }

    values() {
      let obj = items.get(this);
      return Object.values(obj);
    }

    print() {
      let obj = items.get(this);
      // let symbols = Object.getOwnPropertySymbols(obj).map(item => {
      //   return [item, obj[item]]
      // });
      return [...Object.entries(obj)];
    }
  }
})();