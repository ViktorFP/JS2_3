function factorial(n) {
    var res = 1;
    while(n !== 1) {
        res *= n--;
	}
    return res;
}

var reverseString=function(s){
	var newStr='';
	for(var i=s.length-1;i>=0;i--){
		newStr+=s[i];
		}
	return newStr;
};

var MemoizerModule={
	memoizer:function(func){
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
};

console.log(MemoizerModule.memoizer(factorial)(4));

var str='string';
console.log('Reverse String \''+str+'\': '+MemoizerModule.memoizer(reverseString)(str));