
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
		${makePreamble(funcDef)}
		${makeCall(funcDef)}
		${makePostamble(funcDef)}
	}
	`
	return codeString
}


// the code that runs before the function
function makePreamble(funcDef) {
	if(funcDef.params.length === 0) {
		return ``;
	} else if (funcDef.params.length === 1) {
		if(funcDef.params[0].type === 'string') {
			return `let paramString: string = deserialize(e);`;
		} else {
			throw Error("Only string input parameters supported at this time.");
		}
	} else {
		throw Error("Multiple parameters not yet supported for zome functions.");
	}
}


function makeCall(funcDef) {
	let paramString = "";

	if(funcDef.params.length !== 0) {
		paramString = "paramString";
	}

	if(funcDef.returnType === 'void') {
		return `_${funcDef.name}(${paramString});`
	} else {
		return `
		let result: ${funcDef.returnType} = _${funcDef.name}(${paramString});
		`
	}
}


function makePostamble(funcDef) {
	switch(funcDef.returnType) {
		case 'void':
			return `return 0;`;
		case 'string': 
			return 	`return serialize(result)`;
		default:
			throw Error("Return type not yet supported.");
	}
}
