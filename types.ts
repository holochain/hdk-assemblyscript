
@unmanaged
export class CommitResult {
	hash: string;
}

@unmanaged
export class Header {
	entryType: string;
	timestamp: string;
	link: string;
	entryHash: string;
	entrySignature: string;
	linkSameType: boolean;
}

@unmanaged
export class Entry {
	content: string;
	entryType: string;
}

@unmanaged
export class GetResult {
	header: Header;
	entry: Entry;

	constructor() {
		this.header = new Header();
		this.entry = new Entry();		
	}
}

// TODO: reorganise later to be more like the proto interface e.g App.Agent.Hash
@unmanaged
export class Globals {
    app_name: string
    app_dna_hash: string
    app_agent_id_str: string
    app_agent_key_hash: string
    app_agent_initial_hash: string
    app_agent_latest_hash: string
}