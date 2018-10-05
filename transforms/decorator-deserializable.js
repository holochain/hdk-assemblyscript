const {
  CommonFlags,
  Node,
  NodeKind,
  SourceKind,
  TypeKind,
  parseFile
} = require('assemblyscript');


exports.afterParse = function(parser) {

  const entrySrcIdx = parser.program.sources.findIndex(s => s.isEntry)
  const entrySrc = parser.program.sources[entrySrcIdx]

  const deserializableClasses = {}

  entrySrc.statements.forEach(s => {
    if (
      s.kind === NodeKind.CLASSDECLARATION &&
      s.decorators &&
      s.decorators.length &&
      s.decorators.some(d => d.name.text === "deserializable")
    ) {
      if (s.isGeneric) {
        throw Error("Generic classes are not currently @deserializable")
      }

      const fields = []
      s.members.forEach(m => {
        if (m.kind === NodeKind.FIELDDECLARATION) {
          fields.push([m.name.text, m.type.name.text])
        }
      })

      deserializableClasses[s.name.text] = fields
    }
  })
  throw Error(JSON.stringify(deserializableClasses))
}