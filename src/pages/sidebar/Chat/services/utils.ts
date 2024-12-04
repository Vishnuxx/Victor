import { Agent, MessageType } from "../types";
import AgentManager from "./AgentManager";

export function extractResult(inputString: string): string[] {
	const regex = /(?:''')(.*?)(?:''')/g;
	let matches;
	const results = [];

	while ((matches = regex.exec(inputString)) !== null) {
		results.push(matches[1].trim());
	}

	return results;
}


export function getAgent(agent_manager : AgentManager , query : string) : Agent {
	const mentioned_agent = extractResult(query)

	if (mentioned_agent != null) {
		const agent_name = mentioned_agent[0]
		const agent = agent_manager.getAgent(agent_name);
		if (agent != null) {
			return agent
		}
	}

	//default chat model
	const agent: Agent = {
		name: "Assistant",
		type: MessageType.BOT,
		description: "default assistant",
		systemPrompt : ""
	};
	return agent
}


