
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
	const functionArgs = funcDef.parameters.reduce((acc, param) => acc + `${funcDef.name}_Params.${param.name}`, "");


	const codeString = `
	class ${funcDef.name}_Params {
		${paramsAsProperties}
	}

	class ${funcDef.name}_ParamsHandler extends Handler {
		// populate with the correct callbacks
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