export enum MessageType {
	USER = "USER",
	BOT = "BOT",
	AGENT = "AGENT"
}

export enum MessageContextType {
	TEXT = "TEXT",
	REFERENCE = "REFERENCE",
	REPLY = "REPLY"
}

export type MessageContext = {
	title: string;
    type : MessageContextType | string
	content: string;
};

export type MessageHeadProps = {
	type: MessageType | string;
	title: string;
    avatar : string;
	references: MessageContext[];
	content: string;
};


// export type Agent = {
// 	name : string
// 	description : string
// 	systemPrompt : string
// }

// export type UpdatedMessageHeadProp = {
// 	type: MessageType | string;
// };