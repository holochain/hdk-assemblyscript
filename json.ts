
// functions for converting primities and objects/arrays to/from string representation

import {
	itoa,
	dtoa
} from 'internal/number'


export function stringify<T>(x: T): string {
  if ( x instanceof bool ) {
    if (x) {
      return 'true'
    } else {
      return 'false'
    }
  } else if ( x == null) {
    return 'null'
  } else if(isString<T>(x)) {
    return '"'+<string>x+'"';
  } else if (isInteger<T>(x)) {
    return itoa(x);
  } else if (isFloat<T>(x)) {
    return dtoa(x);
  } else if (isArray<T>(x)) {
    let result = '[';
    for(let i = 0; i < x.length; i++) {
      result += stringify(x[i]) + (i < x.length - 1 ? ',' : '')
    }
    return result+=']'

  } else if (isReference<T>(x)) { // must be an object if it is a reference but not a string or array
    return x.toString();
  }
  return 'unknown_type'
}