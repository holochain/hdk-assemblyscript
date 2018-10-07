import "allocator/arena"

@unmanaged
export enum JsmnType {
  UNDEFINED = 0,
  OBJECT = 1,
  ARRAY = 2,
  STRING = 3,
  PRIMITIVE = 4
}

@unmanaged
enum JsmnError {
  /* Not enough tokens were provided */
  JSMN_ERROR_NOMEM = -1,
  /* Invalid character inside JSON string */
  JSMN_ERROR_INVAL = -2,
  /* The string is not a full JSON packet, more bytes expected */
  JSMN_ERROR_PART = -3
}

@unmanaged
export class JsmnToken {
  type: JsmnType;
  start: u32;
  end: u32;
  size: u32;
  parent: u32;
}

@unmanaged
export class JsmnParser {
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


export function unmarshal<T>(
  json: string,
  toks: Array<JsmnToken>
): T {
  // will be rewritten in transform
  return changetype<T>(0)
}
