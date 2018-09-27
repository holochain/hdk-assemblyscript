
/**
 * Produces the assemblyscript to export a zome function
 * Includes deserializing arguments, parsing to local variables, serializing result
 *
 * @param      {FuncDef}  funcDef  The function definition
 * @param      {string} funcDef.name Name of the public zome function
 * @param      {Array<Param>} funcDef.parameters The list of parameters for the function as {name: string, type: string}
 * @param      {string} funcDef.returnType The return type as a string
 */	
export function zomeFunctionString(funcDef) {
	const paramsAsProperties = funcDef.parameters.reduce((acc, param) => acc + `${param.name};
	`, "")
	const functionArgs = funcDef.parameters.reduce((acc, param) => acc + `${funcDef.Name}_Params.${param.name}`;


	const codeString = `


	class ${funcDef.Name}_Params {
		${paramsAsProperties}
	}

	class ${funcDef.Name}_ParamsHandler extends Handler {
		// populate with the correcet callbacks
	}

	export function ${funcdef.Name}(e: u32): u32 {
		const jsonString = deserialize(e);

		// parse the json in to the params object
		const params = new ${funcDef.Name}_Params();
		const handler = new ${funcDef.Name}_ParamsHandler(params);
		parseString<${funcDef.Name}_ParamsHandler>(jsonString, handler)

		const resultString = _${funcDef.name}(${functionArgs});

		return serialize(resultString);
	}
	`
}