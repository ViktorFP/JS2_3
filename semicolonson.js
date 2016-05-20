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
						console.log('rest = '+all.substring(all.search('[|]')));
					var attStartIdx=rest.search('[(]'), attEndIdx=rest.search('[)]');
						var attr='',strReturn;
						if(attStartIdx>-1){
						attr=rest.substring(attStartIdx+1,attEndIdx);
						strReturn=rest.substring(attEndIdx+4,rest.length-4);			
							}else{
							strReturn=rest.substring(1,rest.length-2);
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
				if(prop && !Array.isArray(obj[prop])){
					str+=padding+prop+': \''+obj[prop]+'\',\n';
					}else{
					hasArray=true;
					var array=obj[prop];
					str+='  '+prop+': [\n';
					for(var i=0;i<array.length;i++){
						str+=padding+padding+'{ ';
						var arrObj=array[i];
						for(var key in arrObj){
							if(key){
								str+=key+': \''+arrObj[key]+'\'';
							}
						}
						str+=' },\n';
					}
				}				
			}
			str=str.substring(0,str.length-2);
			if(hasArray){
				str+='\n'+padding+']';
			}
			return str;			
		}
		return {parse:createObj,
		print:objDataToString};
	})();
	//--------------------------------
var data1 = ';key,value;key1,value1;key3,value3;';
var data2 = ';key,value;key1,value1;arrayHere:k1,v1;k2,v2;k3,v3';

// => { key: 'value',  method: function() {return true;} }
	var data3 =';key,value3;methodName,|return true|;';
	
	// => { key: 'value',  method: function(a) {return a + 1;} }
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
	console.log('\nobj3: '+obj3.methodName());
	console.log('obj4: '+obj4.methodName(3));
})();