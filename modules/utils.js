(function(self){
	let obj = self.yzfUtils = Object.create(null)
	
	obj.shadowCopy = (src) => {
		let dst = {};
		
		for (let prop in src) {
			if (src.hasOwnProperty(prop)) {
				dst[prop] = src[prop];
			}
		}
		
		return dst;
	}
	
	obj.deepCopy = (src){
	  // 基本类型和null特殊处理
	  if(typeof src !== 'object' || src === null){
	    return src;
	  }

	  // 判断最外层是数组还是对象
	  let target = Array.isArray(src) ? [] : {};

	  // 通过循环遍历复制
	  for(let key in src){
	    if(src.hasOwnProperty(key)){
	      // 如果内层为对象或数组（递归处理）
	      if(src[key] && typeof src[key] === 'object' && src[key] !== null){
		target[key] = deepClone(src[key]);
	      }else{
		target[key] = src[key];
	      }
	    }
	  }

	  return target;
	}
	
   /*
    * 返回字符长度（包括基本平面BMP-—Basic Multilingual Plane和补充平面Supplementary Plane）
    * @param {string} str 需要计算长度的字符串
    * @returns {number} 字符串的长度  
    */
	obj.strLength = (str) => {
        // 匹配补充平面（Supplementary Plane）Unicode
        const SPRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

        return str.replace(SPRegexp, '_').length;
    }
	
	
	
})(window)
