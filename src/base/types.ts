export enum ContextMenuItems {
	SUMMARISE = "summarise_item",
	TRANSLATE = "translate_selection",
	ASK = "ask_selection",
	WRITE = "write_item",
	REWRITE = "rewrite_item",
}



export interface EventMessage {
	value: object | string | number | boolean | null;
	action: string | number | boolean;
}

export enum Signals {
	GET_DOM_TEXT = "GET_DOM_TEXT",
	GET_INTENT_RECOMMENDATION = "GET_INTENT_RECOMMENDATION",
}

export interface HistoryItem {
	title: string;
	url: string;
	lastVisitTime: string;
}
