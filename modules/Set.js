
// 集合（Set）是一种包含不同元素的数据结构。集合中的元素称为成员，集合最重要的两个特点：
// 集合中的成员是无序；
// 集合中不存在相同成员；

const _items = Symbol();
export default class Sets {
    constructor(){
        this[_items] = {};
    }

    // 集合是否存在某个成员
    has(value){
        // return value in this.items
        return this[_items].hasOwnProperty(value);
    }

    // 集合添加成员
    add(value){
        if(!this.has(value)) {
            this[_items][value] = value;
            return true;
        }
        return false;
    }

    // 集合删除成员
    delete(value){
        if(!this.has(value)){
            delete this[_items][value];
            return true;
        }
        return false;
    }

    // 集合置空
    clear(){
        this[_items] = {};
    }

    // 集合成员计数
    size(){
        const values = this.values();
        return values.length;
    }

    // 集合成员值
    values(){
        return Object.keys(this[_items]);
    }
}

/**
 * union 并集
 * @param {Object} otherSet 其他集合
 */
Sets.prototype.union = function(otherSet){
    let result = new Sets(),
        current = this.values(),
        other = otherSet.values()
    for(let i = 0; i < current.length; i++){
        result.add(current[i])
    }
    for(let i = 0; i < other.length; i++){
        result.add(other[i])
    }
    return result
}

/**
 * intersection 交集
 * @param {Object} otherSet 其他集合
 */
Sets.prototype.intersection = function(otherSet){
    let result = new Sets(),
        current = this.values()
    for(let i = 0; i < current.length; i++){
        if(otherSet.has(current[i])){
            result.add(current[i])
        }
    }
    return result
}

/**
 * difference 差集
 * @param {Object} otherSet 其他集合
 */
Sets.prototype.difference = function(otherSet){
    let result = new Sets(),
        current = this.values()
    for(let i = 0; i < current.length; i++){
        if(!otherSet.has(current[i])){
            result.add(current[i])
        }
    }
    return result
}

/**
 * subset 子集
 * @param {Object} otherSet 其他集合
 */
Sets.prototype.subset = function(otherSet){
    let result = new Sets(),
        current = this.values()

    if(this.size() > otherSet.size()) return false
    for(let i = 0; i < current.length; i++){
        if(!otherSet.has(current[i])){
            return false
        }
    }
    return true
}

