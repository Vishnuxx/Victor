

export enum MessageType {
	USER = "USER",
	BOT = "BOT",
}

export enum MessageContextType {
	TEXT = "TEXT",
	REFERENCE = "REFERENCE",
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
// 	type : MessageType
// 	description : string
// 	systemPrompt : string
// }

enum AgentBaseType {
	PROMPT,
	SUMMARIZATION,
	WRITER,
	REWRITER,
}

// export type Agent = {
// 	name: string;
// 	type: AgentBaseType;
// 	description: string;
// 	systemPrompt: string;
// 	topK: number;
// 	temperature: number;
// };

export enum AgentType {
	PROMPT,
	SUMMARIZATION,
	WRITER,
	REWRITER,
}

export interface Agent  {
	name: string;
	type: AgentType;
	description: string;
	systemPrompt: string;
	topK: number;
	temperature: number;
};
