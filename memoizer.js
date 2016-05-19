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
		var cache={};
		function f(func){
			if (typeof func !== 'function'){		
				throw 'ArgumentError: function expected';
			}
			return function(){
				var key=arguments.length + Array.prototype.join.call(arguments,',');
				if(!(key in cache)){
					console.log('cache don\'t has key '+key);
					cache[key] = func.apply(this, arguments);
				}
				console.log(cache[key]);				
				return cache[key];
			};
		}
		return {memoizer:f};
	})();
	//-------------------------------------------	
	//memoizer can work with function which apply single argument
	var n=4;
	console.log('factorial('+n+'): ');
	MemoizerModule.memoizer(factorial)(n);
	MemoizerModule.memoizer(factorial)(n);
	
	var str='string';
	console.log('\nReverse String \''+str+'\': ');
	MemoizerModule.memoizer(reverseString)(str);
	//...and with functions which apply several arguments
	console.log('\ngenerate array:');
	MemoizerModule.memoizer(getIntArray)(10,10);
	//no different)
}());