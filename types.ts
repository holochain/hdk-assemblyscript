import { Handler } from './index'

export class CommitResult {
	hash: string
}


export class CommitResultParser extends Handler {
	commitResult: CommitResult

	constructor(commitResult: CommitResult) {
		super()
		this.commitResult = commitResult;
	}

	onString(value: string): void {
		if(value == "hash") {
			this.commitResult.hash = value;
		}
	}
}