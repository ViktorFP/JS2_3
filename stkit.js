/** 
	@module STKit
	@version 1.0.0
	@author Viktar Pryshchepau <viktarpryshchepau@gmail.com>
*/
window.STKit=(function(){
	/**
		Return memoized version of any given function.
		@param {Function} func - function which be memoized
		For execution you must write:
		STKit.memoizer(function)([arguments]);
	*/
	var cache={};
	function memo(func){
		if(func){
			if (typeof func !== 'function'){		
				throw 'ArgumentError: function expected';
			}
			return function(){
				var key=arguments.length + Array.prototype.join.call(arguments,',');
				if(!(key in cache)){
					cache[key] = func.apply(this, arguments);
				}
				return cache[key];
			};
		}
		return null;
	}
	
	/**
		Function return new object with only state within 
		or mutate existing object and return array with all behavior 
		in it depending on second boolean argument.
		@param {Object} obj - start object
		@param {Boolean} flag for 
		@returns {Object|Array} object with state array with behavior
		For execution you must write:
		STKit.debehaviorizer(obj[, flag]);
	*/
	function behavior(obj, flag){		
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
							break;
							case 'object':
							behaviorArray[position++]=behaviorSeparate(a[prop]);							
							break;
						}
					}
				}
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
		return newObj;}
		
		return (function(){
			if(flag){
				return behaviorSeparate(obj);
				}else{
				return stateObject(obj);			
			}
		})();
	}
	//--
	/**
		The function for adding to object functions from array.
		@param {Object} obj - object
		@param {Array} fArray - array with functions 
		@returns {Object} current object
		For execution you must write:
		STKit.addMethods(object,array);
	*/
	function methods(obj, fArray){
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
						methods(obj,temp);
						break;
					}
				}
			}
			return obj;
		})();
	}
	//--
	/**
		Function for creat object from string.
		@param {String} str - string for parsing
		@returns {Object} new object
		For execution you must write:
		STKit.stringToObject(string);
	*/
	function createObj(str){
		var data=(''+str).split(';');
		var newObj={};
		for(var i=0;i<data.length;i++){
			var fieldData=data[i].split(',');		
			if(fieldData[0]!==''){
				if(fieldData[0].search(':')>-1){
					var array=fieldData[0].split(':');
					var arrName=array[0];
					var innerArr=[];
					var arrObj={};
					arrObj[array[1]]=fieldData[1];
					innerArr[0]=arrObj;
					i++;
					for(var j=1;i<data.length;j++,i++){
						arrObj={};
						fieldData=data[i].split(',');
						arrObj[fieldData[0]]=fieldData[1];
						innerArr[j]=arrObj;
					}
					newObj[arrName]=innerArr;
					continue;
				}
				//--
				if(fieldData[1].search('[|]')>-1){
					var all=''+str, rest=all.substring(all.search('[|]'));
					var attStartIdx=rest.search('[(]'), attEndIdx=rest.search('[)]');
					var attr='',strReturn;
					if(attStartIdx>-1){
						attr=rest.substring(attStartIdx+1,attEndIdx);
						strReturn=rest.substring(attEndIdx+4);					
						strReturn=strReturn.substring(0,strReturn.search('[|]')-2);						
						}else{							
						strReturn=rest.substring(1);	
						strReturn=strReturn.substring(0,strReturn.search('[|]'));
					}
					//WARNING!!!
					//The Function constructor is a form of eval
					newObj[fieldData[0]]=new Function(attr, strReturn);
					return newObj;
				}
				//--
				newObj[fieldData[0]]=fieldData[1];				
			}
		}
		return newObj;
	}
	//--
	/**
		Function for getting string view of object from object.
		@param {Object} obj - object
		@returns {String} string view of object
		For execution you must write:
		STKit.printObjectView(object);
	*/
	function objDataToString(obj){
		var str='', padding='  ', hasArray=false;
		for(var prop in obj){				
			if(prop){
				switch(typeof obj[prop]){
					case 'object':
					if(Array.isArray(obj[prop])){
						hasArray=true;
						var array=obj[prop];
						str+='  '+prop+': [\n';
						for(var i=0;i<array.length;i++){
							str+=padding+padding+'{ ';
							var arrObj=array[i];
							str=(function(){
								for(var key in arrObj){									
									if(key){
										str+=key+': \''+arrObj[key]+'\'';
									}										
								}
								return str;
							})();
							str+=' },\n';
						}
					}
					break;
					case 'function':
					str+=padding+prop+': '+obj[prop]+',\n';
					break;
					default:
					str+=padding+prop+': \''+obj[prop]+'\',\n';
				}
			}				
		}
		str=str.substring(0,str.length-2);
		if(hasArray){
			str+='\n'+padding+']';
		}
		return str;			
	}
	//--
	/**
		Function for getting string from object.
		@param {Object} obj - object
		@returns {String} string description of object
		For execution you must write:
		STKit.objectToStringData(object);
	*/
	function toString(obj){
		var str=JSON.stringify(obj), finalStr=';';
		for(var i=1;i<str.length;i++){	
			finalStr=checkFormat(str[i],finalStr);				
		}
		if(arguments[1]){
			finalStr=printFunction(obj,finalStr);
		}
		return finalStr;
	}
	/**
		Help function for function toString(obj).
		@see toString
		@param {Object} obj - object
		@param {String} finalStr - string description of object
		@returns {String} finalStr - changed string description of object
	*/
	function printFunction(obj,finalStr){								
		for(var prop in obj){
			if(prop && typeof obj[prop]==='function'){
				finalStr+=';'+prop+',|';
				var strF=''+obj[prop],
				returnStr=strF.substring(strF.search('{')+2,strF.length-2),
				attr=strF.substring(strF.search('[(]')+1,strF.search('[)]'));
				if(attr.search('[/]')>-1){
					attr=attr.substring(0,attr.length-5);
				}
				if(attr.length<1){
					finalStr+=returnStr;
					}else{
					finalStr+='function ('+attr+') { '+returnStr+' }';
				}
				finalStr+='|;';
			}
		}
		return finalStr;
	}
	/**
		Help function for function toString(obj).
		@see toString
		@param {String} ch - char from string view
		@param {String} finalStr - string description of object
		@returns {String} finalStr - changed string description of object
	*/
	function checkFormat(ch, finalStr){
		switch(ch){									
			case ',':
			finalStr+=';';
			break;
			case ':':
			finalStr+=',';
			break;
			case '[':
			finalStr=finalStr.substring(0,finalStr.length-1);
			finalStr+=':';
			break;
			case '"':
			case ']':
			case '{':
			case '}':
			break;
			default:finalStr+=ch;
		}
		return finalStr;
	}
	//--
	return {memoizer:memo,
		debehaviorizer:behavior,
		addMethods:methods,
		stringToObject:createObj,
		printObjectView:objDataToString,
		objectToStringData:toString
	};
}());