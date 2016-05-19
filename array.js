(function(){
	console.log('[] is array: '+isArrayLike([]));
    console.log('{} is array: '+isArrayLike({}));
	
	var objLA={
		1:1,
		2:2,
		3:3,
		length:3
	};
	
	console.log('objLA is like array: '+isArrayLike(objLA));
    //-----------------------------
    function isArrayLike(obj){
		var isArray=function(){
			return Function.isArray || (function(){
			return (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');}());       
		};
		
		function likeArray() {
			if (obj && typeof obj === 'object' &&
			isFinite(obj.length) && obj.length >= 0 &&
			obj.length===Math.floor(obj.length) && 
			obj.length < 4294967296)//obj.length < 2^32
			{return true;}
			return false;			
		}		
		return isArray() || likeArray();
	}
})();