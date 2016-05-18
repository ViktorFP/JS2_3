(function(){
	function getIntArray(number,range){
	var array=[];
	for(var i=0;i<number;i++){
		array[i]=Math.round(Math.random()*range);
	}
	return array;
}

function factorial(n) {
		var res = 1;
		while(n !== 1) {
			res *= n--;
		}
		return res;
	}
	
	function reverseString(s){
		var newStr='';
		for(var i=s.length-1;i>=0;i--){
			newStr+=s[i];
		}
		return newStr;
	}
	
	var MemoizerModule=(function(){
		function f(func){
			if (typeof func !== 'function'){		
				throw 'ArgumentError: function expected';
			}
			var cache={};
			return function(n){
				var value;
				if(n in cache){
					value = cache[n];
					}else{
					value=func.apply(this, arguments);
					cache[n] = value;
				}
				console.log(value);				
				return value;
			};
		}
		return {memoizer:f};
		})();
	//-------------------------------------------	
	var n=4;
	console.log('factorial('+n+'): ');
	MemoizerModule.memoizer(factorial)(n);
	
	var str='string';
	console.log('\nReverse String \''+str+'\': ');
MemoizerModule.memoizer(reverseString)(str);
console.log('\ngenerate array:');
MemoizerModule.memoizer(getIntArray)(10,10);
}());