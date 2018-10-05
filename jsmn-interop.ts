
enum JsmnType {
  UNDEFINED = 0,
  OBJECT = 1,
  ARRAY = 2,
  STRING = 3,
  PRIMITIVE = 4
}

enum JsmnError {
  /* Not enough tokens were provided */
  JSMN_ERROR_NOMEM = -1,
  /* Invalid character inside JSON string */
  JSMN_ERROR_INVAL = -2,
  /* The string is not a full JSON packet, more bytes expected */
  JSMN_ERROR_PART = -3
}

class JsmnToken {
  type: JsmnType;
  start: u32;
  end: u32;
  size: u32;
  parent: u32;
}

class JsmnParser {
  pos: u32; /* offset in the JSON string */
  toknext: u32; /* next token to allocate */
  toksuper: i32; /* superior token node, e.g parent object or array */
}

// class Target {
//   key: string;
//   val: JsmnToken; // pointer to value
//   custom: boolean;
//   type: Target;
// }

// int jsmn_parse(jsmn_parser *parser, const char *js, size_t len,
//     jsmntok_t *tokens, unsigned int num_tokens);

// const json: string = `
//   {
//     "a": 0,
//     "b": "x",
//     "c": [1, 2, 3]
//   }
// `

const json: string = `{"a": 0, "b": "x", "c": [1, 2, 3]}`

function tok(type: JsmnType, start: u32, end: u32): JsmnToken {
  const t = new JsmnToken()
  t.type = type
  t.start = start
  t.end = end
  return t
}

const toks: Array<JsmnToken> = [
  tok(JsmnType.OBJECT, 0, 34),
  tok(JsmnType.STRING, 2, 3),
  tok(JsmnType.PRIMITIVE, 6, 7),
  tok(JsmnType.STRING, 10, 11),
  tok(JsmnType.STRING, 15, 16),
  tok(JsmnType.STRING, 20, 21),
  tok(JsmnType.ARRAY, 24, 33),
  tok(JsmnType.PRIMITIVE, 25, 26),
  tok(JsmnType.PRIMITIVE, 28, 29),
  tok(JsmnType.PRIMITIVE, 31, 32),
]

export function unmarshal(
  toks: Array<JsmnToken>
) {

}