
export class CommitResult {
	hash: string = ""
}

export class Header {
	entryType: string = ""
	timestamp: string = ""
	link: string = ""
	entryHash: string = ""
	entrySignature: string = ""
	linkSameType: boolean = false
}

export class Entry {
	content: string = ""
	entryType: string = ""
}

export class GetResult {
	header: Header = new Header();
	entry: Entry = new Entry();
}
