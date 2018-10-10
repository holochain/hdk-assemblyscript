
// functions for converting primities and objects/arrays to/from string representation

import {
	itoa,
	dtoa
} from 'internal/number'


export function stringify<T>(x: T): string {
  if(isString<T>(x)) {
  	return <string>x;
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

  } else if (x == null) {
  	return 'null'
  }
  return 'unknown_type'
}


