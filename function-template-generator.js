
/**
 * Produces the assemblyscript to export a zome function
 * Includes deserializing arguments, parsing to local variables, serializing result
 *
 * @param      {FuncDef}  funcDef  The function definition
 * @param      {string} funcDef.name Name of the public zome function
 * @param      {Array<Param>} funcDef.parameters The list of parameters for the function as {name: string, type: string}
 * @param      {string} funcDef.returnType The return type as a string
 */	
exports.makeFunctionString = function(funcDef) {
	const paramsAsProperties = funcDef.parameters.reduce((acc, param) => acc + `${param.name}: ${param.type};
	`, "")

	var functionArgs = funcDef.parameters.reduce((acc, param) => acc + `${funcDef.name}_Params.${param.name}, `, "");
	functionArgs = functionArgs.substring(0, functionArgs.length-2); // remove comma and space for last arg

	// sort the params in to buckets based on their correct callbacks
	const callbacks = {
		onString: [],
		onInt: [],
		onFloat: [],
		onBool: [],
	}

	funcDef.parameters.forEach((param) => {
		switch(param.type) {
			case 'string':
				callbacks.onString.push(param);
				break;
			case 'i32':
				callbacks.onInt.push(param);
				break;
			case 'f64':
				callbacks.onFloat.push(param);
				break;
			case 'boolean':
				callbacks.onBool.push(param);
				break;
		}
	});

	// write out the code for the custom Handler class
	let callbacksString = "";
	Object.keys(callbacks).forEach((key) => {
		const params = callbacks[key];
		if(params.length > 0) {
			callbacksString += `
			${key}(keyStack: Array<string>, value: ${params[0].type}): void {
				switch(keyStack[keyStack.length-1]){
			`

			params.forEach(param => {
				callbacksString += `case "${param.name}":
				this.params.${param.name} = value;
				break;
				`
			});

			callbacksString += `}
		}`
		}

	});

	const codeString = `
	class ${funcDef.name}_Params {
		${paramsAsProperties}
	}

	class ${funcDef.name}_ParamsHandler extends Handler {
		params: ${funcDef.name}_Params;
		constructor(params: ${funcDef.name}_Params) {
			this.params = params;
		}
		${callbacksString}
	}

	export function ${funcDef.name}(e: u32): u32 {
		const jsonString = deserialize(e);

		// parse the json in to the params object
		const params = new ${funcDef.name}_Params();
		const handler = new ${funcDef.name}_ParamsHandler(params);
		parseString<${funcDef.name}_ParamsHandler>(jsonString, handler)

		const resultString = _${funcDef.name}(${functionArgs});

		return serialize(resultString);
	}
	`
	return codeString
}