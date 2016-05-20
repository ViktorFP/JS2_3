(function(){
	var ObjectParser=(function(){	
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
		return {parse:createObj,
			print:objDataToString,
		getString:toString};
	})();
	//--------------------------------
	var data1 = ';key,value;key1,value1;key3,value3;';
	var data2 = ';key,value;key1,value1;arrayHere:k1,v1;k2,v2;k3,v3';
	var data3 =';key,value3;methodName,|return true|;';
	var data4 =';key,value4;methodName,|function (a) { return a + 1; }|;';
	
	var obj1=ObjectParser.parse(data1);
	var obj2=ObjectParser.parse(data2);
	var obj3=ObjectParser.parse(data3);
	var obj4=ObjectParser.parse(data4);
	console.log(data1+'\n\nobj1 = {\n'+ObjectParser.print(obj1)+'\n};\n');
	console.log(data2+'\n\nobj2 = {\n'+ObjectParser.print(obj2)+'\n};\n');
	console.log(data3+'\n\nobj3 = {\n'+ObjectParser.print(obj3)+'\n};\n');
	console.log(data4+'\n\nobj4 = {\n'+ObjectParser.print(obj4)+'\n};\n');	
	//--
	console.log('\n'+ObjectParser.getString(obj1));
	console.log('\n'+ObjectParser.getString(obj2));
	console.log('\n'+ObjectParser.getString(obj3,true));
	console.log('\n'+ObjectParser.getString(obj4));
	console.log('\n'+ObjectParser.getString(obj4,true));	
})();