
export default (function() {
  let items = new WeakMap();

  return class Sets {

    constructor() {
      items.set(this, {});
    }

    add(value: any): boolean {
      let obj = items.get(this);
      if(this.has(value)) {
        return false;
      }
      obj[value] = value;
      return true;
    }

    delete(value: any) {
      let obj = items.get(this);
      if(this.has(value)) {
        delete obj[value];
        return true;
      }
      return false;
    }

    has(value: any): boolean{
      let obj = items.get(this);
      return Object.values(obj).includes(value);
    }

    size() {
      let obj = items.get(this);
      return Object.values(obj).length || 0;
    }

    clear() {
      items.set(this, {});
    }

    values() {
      let obj = items.get(this);
      return Object.values(obj) || [];
    }

    // 并集
    union(otherSet: Sets) {
      let unionSet = new Sets();
      const values1 = this.values();
      const values2 = otherSet.values();

      values1.forEach(item => {
        if(!unionSet.has(item)) {
          unionSet.add(item);
        }
      });

      values2.forEach(item => {
        if(!unionSet.has(item)) {
          unionSet.add(item);
        }
      });

      return unionSet;
    }

    // 交集
    intersection(otherSet: Sets) {
      let unionSet = this.union(otherSet);
      let newSet = new Sets();
      unionSet.values().forEach(item => {
        if(this.has(item) && otherSet.has(item)) {
          newSet.add(item);
        }
      });

      return newSet;
    }

    // 差集
    difference(otherSet: Sets) {
      let newSet = new Sets();
      this.values().forEach(item => {
        if(!otherSet.has(item)) {
          newSet.add(item);
        }
      });

      return newSet;
    }

    // 是否为子集
    isSubSet(otherSet: Sets) {
      let array = this.values();
      return otherSet.values().every(item => {
        return array.includes(item);
      });
    }

    print() {
      let obj = items.get(this);
      return Object.values(obj).reduce((acc: any, item, index) => {
        return acc + item + ';';
      }, '');
    }
  }
})();

// ES6的并集
// let unionAb = new Set(); //{1}
// for (let x of setA) unionAb.add(x); //{2}
// for (let x of setB) unionAb.add(x); //{3}

// 交集
// let intersection = function(setA, setB) {
//   let intersectionSet = new Set();
//   for (let x of setA) {
//     if (setB.has(x)) { //{1}
//       intersectionSet.add(x);
// } }
//   return intersectionSet;
// };
// let intersectionAB = intersection(setA, setB);

// 差集
// let difference = function(setA, setB) {
//   let differenceSet = new Set();
//   for (let x of setA) {
//  if (!setB.has(x)) { //{1}
// } }
//   return differenceSet;
// };
//  let differenceAB = difference(setA, setB);