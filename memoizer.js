(function(){
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
			var memo={};
			return function(n){
				var value;
				if(n in memo){
					value = memo[n];
					}else{
					value=func.apply(this, arguments);
					memo[n] = value;
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
	console.log('Reverse String \''+str+'\': ');
MemoizerModule.memoizer(reverseString)(str);
}());