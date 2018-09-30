
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
	const codeString = `
	export function ${funcDef.name}(e: u32): u32 {
		const paramString = deserialize(e);
		const resultString = _${funcDef.name}(paramString);
		return serialize(resultString);
	}
	`
	return codeString
}
