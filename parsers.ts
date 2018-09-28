import { Handler } from './index';

import {
	CommitResult, 
	GetResult
} from './types';

export class CommitResultParser extends Handler {
	commitResult: CommitResult

	constructor(commitResult: CommitResult) {
		this.commitResult = commitResult;
	}

	onString(keyStack: Array<string>, value: string): void {
		if(keyStack[keyStack.length-1] == "hash") {
			this.commitResult.hash = value;
		}
	}
}



export class GetResultParser extends Handler  {
	getResult: GetResult;

	constructor(getResult: GetResult) {
		this.getResult = getResult;
	}

	// onString(keyStack: Array<string>, value: string): void {
	// 	if(keyStack[keyStack.length-1] == "header") {
	// 		if(keyStack[keyStack.length-2] == "entry_type") {
	// 			this.getResult.header.entryType = value;
	// 		} else if (keyStack[keyStack.length-2] == "timestamp") {
	// 			this.getResult.header.timestamp = value;
	// 		} else if (keyStack[keyStack.length-2] == "link") {
	// 			this.getResult.header.link = value;
	// 		} else if (keyStack[keyStack.length-2] == "entry_hash") {
	// 			this.getResult.header.entryHash = value;
	// 		} else if (keyStack[keyStack.length-2] == "entry_signature") {
	// 			this.getResult.header.entrySignature = value;				
	// 		}
	// 	} else if (keyStack[keyStack.length-1] == "entry") {
	// 		if(keyStack[keyStack.length-2] == "entry_type") {
	// 			this.getResult.entry.entryType = value;
	// 		} else if (keyStack[keyStack.length-2] == "content") {
	// 			this.getResult.entry.content = value;
	// 		}
	// 	}
	// }

	// onBool(keyStack: Array<string>, value: boolean): void {
	// 	if(keyStack[keyStack.length - 1] == "header" && keyStack[keyStack.length - 2] == "link_same_type") {
	// 		this.getResult.header.linkSameType = value;
	// 	}
	// }
}