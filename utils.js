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
	
	
	
	
	
	
})(window)