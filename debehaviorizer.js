(function(){
	var obj={
		a:1,
		b:'str',
		f:function(){return 'someMethod';},
		f2:function(){return 'someMethod2';},
		ar:['ar1', 'ar2', function(){return 'function in array of obj';}],
		o:{
			oa:2,
			of:function(){return 'method from o';}
		}
	};
	
	//Object.freeze(obj);
	//Object.seal(obj);	
	Object.defineProperty(obj, 'f', {configurable: false});
	console.log('only state: ');
	debehaviorizer(obj);
	console.log('\nchange current object:');	
	var array=debehaviorizer(obj, true);
	console.log('\narray of behavior:');	
	printFunctionArray(array);
	//example for using (it's for me on future :))
	console.log(array[0]());
	//--------------------------
	function printFunctionArray(arr){
		for(var i=0;i<arr.length;i++){
			if(typeof arr[i] === 'object'){
				printFunctionArray(arr[i]);
				}else{
				console.log(arr[i]);
			}
		}
	}
	
	function debehaviorizer(obj, flag){
		function printField(o){
			for(var prop in o){
				if(prop){
					if((typeof o[prop] === 'object') === false){
						console.log(prop);
					}
				}
			}
		}
		
		function behaviorSeparate(a){
			'use strict';
			var behaviorArray=[], position=0;
			if(typeof a === 'object' && a !== null){			
				for(var prop in a){				
					if(prop){
						switch(typeof a[prop]){
							case 'function':
							behaviorArray[position++]=a[prop];
							if(!Object.isFrozen(a) &&
							!Object.isSealed(a)){
								try{
									delete a[prop];
									continue;
								}catch(e){}
							}
							console.log('Deleting the \''+prop+'\' is impossible');		
							break;
							case 'object':
							behaviorArray[position++]=behaviorSeparate(a[prop]);							
							break;
						}
					}
				}
				printField(a);
			}
		return behaviorArray;}
		
		function stateObject(o){
			var newObj={};
			for(var prop in o){
				if(prop){
					switch(typeof o[prop]){
						case 'function':
						break;
						case 'object':
						stateObject(o[prop]);
						break;
						default:
						newObj[prop]=o[prop];
					}
				}
			}
			printField(newObj);
		return newObj;}
		
		return (function(){
			if(flag){
				return behaviorSeparate(obj);
				}else{
				return stateObject(obj);			
			}
		})();
	}	
})();			