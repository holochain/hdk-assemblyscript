const assemblyscript = require('assemblyscript');
const {
  CommonFlags,
  Node,
  NodeKind,
  SourceKind,
  TypeKind,
  parseFile
} = assemblyscript;



/*
*   @can_stringify decorator
*   ========================
*   Adds the method toString to any class which returns a json string with all the class members include. 
*   Can also convert nested objects and arrays but each object must imlement a toString method
*
*/

exports.applyTransform = function(parser) {

  const entrySrcIdx = parser.program.sources.findIndex(s => s.isEntry)
  const entrySrc = parser.program.sources[entrySrcIdx]

  entrySrc.statements.forEach((s, i) => {
    if (
      s.kind === NodeKind.CLASSDECLARATION &&
      s.decorators &&
      s.decorators.length &&
      s.decorators.some(d => d.name.text === "can_stringify")
    ) {
      if (s.isGeneric) {
        throw Error("Generic classes can not use @can_stringify")
      }

      // grab the names of all the members
      let members = s.members
        .filter(member => member.kind == 48) // NodeKind for a class member not method
        .map(member => member.name.text) 

      // Make a string version of the toString function
      let formatList = members.reduce((acc, member, i) => {
        return acc+`'"${member}":'+stringify(this.${member})+${(i < members.length - 1) ? `','+` : `''`}`
      }, "")

      let toStringCode = `
  toString(): string {
    return '{'+${formatList}+'}';
      }
      `
      // insert it in to the code
      let source = s.range.source.text;
      let updatedSource = source.slice(0, s.range.end) + toStringCode + source.slice(s.range.end)

      // build the whole thing again
      const newMember = parseFile(
        updatedSource,
        entrySrc.range.source.normalizedPath, 
        true,
        null
      ).program.sources[0].statements[i].members[0];

      // insert it in the tree
      s.members.push(newMember);
    }
  })
}