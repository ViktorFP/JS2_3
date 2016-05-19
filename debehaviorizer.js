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
	console.log(obj);
	//Object.freeze(obj);
	//Object.seal(obj);	
	Object.defineProperty(obj, 'f', {configurable: false});
	console.log('only state: ');
	debehaviorizer(obj);
	console.log('\nchange current object:');	
	var array=debehaviorizer(obj, true);
	console.log('\narray of behavior:');	
	printFunctionArray(array);
	
	//merge state with behavior
	console.log(addMethods(obj,array));
	//--------------------------
	function addMethods(obj, fArray){
		if(arguments.length!==2){
			return arguments.length===0?{}:obj;
		}		
		if(!Array.isArray(fArray)){
			return obj;
		}		
		return (function(){
			for(var j=0;j<fArray.length;j++){
				var temp=fArray[j];
				if(temp){
					switch(Object.prototype.toString.call(temp).slice(8,-1)){
						case 'Object':
						for(var prop in temp){
							if(typeof temp[prop] === 'function'){
								obj[prop]=temp[prop];
							}
						}
						break;
						case 'Array':
						addMethods(obj,temp);
						break;
					}
				}
			}
			return obj;
		})();
	}
	
	function printFunctionArray(arr){
		for(var pos in arr){
			if(Array.isArray(arr[pos])){
				printFunctionArray(arr[pos]);
				}else{
				var temp=arr[pos];
				if(typeof temp === 'object'){
					for(var prop in temp){
						if(prop){
							console.log(prop+':'+temp[prop]);
						}
					}
				}
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
			if(typeof a === 'object' && a){			
				for(var prop in a){				
					if(prop){
						switch(typeof a[prop]){
							case 'function':
							var newF={};
							newF[prop]=a[prop];
							behaviorArray[position++]=newF;							
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