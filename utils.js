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
	
	obj.deepCopy = (obj) => {
		let str, newobj = obj.constructor === Array ? [] : {};
		
		if(typeof obj !== 'object'){
			return;
		} else if(window.JSON){
			str = JSON.stringify(obj), //系列化对象
			newobj = JSON.parse(str); //还原
		} else {
			for(let i in obj){
				newobj[i] = typeof obj[i] === 'object' ? 
				obj.deepCopy(obj[i]) : obj[i]; 
			}
		}
		
		return newobj;
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