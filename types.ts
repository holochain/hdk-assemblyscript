import { Handler } from './index'

export class CommitResult {
	hash: string = ""
}


export class CommitResultParser extends Handler {
	commitResult: CommitResult

	constructor(commitResult: CommitResult) {
		this.commitResult = commitResult;
	}

	onString(value: string): void {
		if(this.currentKey == "hash") {
			this.commitResult.hash = value;
		}
	}
}