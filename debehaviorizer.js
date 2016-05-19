(function(){
	var obj={
		a:1,
		b:'str',
		f:function(){return 'someMethod';},
		f2:function(){return 'someMethod2';}
	};
	
	//Object.freeze(obj);
	//Object.seal(obj);	
	Object.defineProperty(obj, 'f', {configurable: false});
	console.log('only state: ');
	debehaviorizer(obj);
	console.log('\nchange current object:');	
	var array=debehaviorizer(obj, true);
	console.log('\narray of behavior:');	
	for(var i=0;i<array.length;i++){
		console.log(array[i]);
	}
	//example for using (it's for me on future :))
	console.log(array[0]());
	//--------------------------
	function debehaviorizer(obj, flag){
		function printField(o){
			for(var prop in o){
					if(prop){console.log(prop);}
				}
				}
		
		function behaviorSeparate(){
			'use strict';
			var behaviorArray=[], position=0;
			if(typeof obj === 'object' && obj !== null){			
				for(var prop in obj){
					if(typeof obj[prop] === 'function'){
						behaviorArray[position++]=obj[prop];
						if(!Object.isFrozen(obj) &&
						!Object.isSealed(obj)){
							try{
								delete obj[prop];
								continue;
							}catch(e){}
						}
						console.log('Deleting the \''+prop+'\' is impossibly');										
					}
				}
				printField(obj);
			}
		return behaviorArray;}
		
		function stateObject(){
			var newObj={};
			for(var prop in obj){
			if((typeof obj[prop] === 'function')===false){
				newObj[prop]=obj[prop];
				}
			}
			printField(newObj);
			return newObj;}
		
		return (function(){
			if(flag){
				return behaviorSeparate();
				}else{
				return stateObject();			
			}
		})();
	}	
})();