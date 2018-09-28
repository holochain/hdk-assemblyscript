import { Handler } from './index'

export class CommitResult {
	hash: string = ""
}


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