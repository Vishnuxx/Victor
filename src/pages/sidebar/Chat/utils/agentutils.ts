import { Agent, AgentType, MessageContext, MessageHeadProps } from "../types";

export function extractFirstAtWord(str: string) {
	const trimmedStr = str.trim();
	const words = trimmedStr.split(/\s+/);
	const starts = words[0].startsWith("@");
	return starts ? words[0].slice(1, words[0].length) : null;
}

const createPrompt = (system: string, references: MessageContext[], user: string) => {
	// Initialize the prompt with the system prompt section
	let prompt = "---\n# System Prompt:\n\n";
	prompt += system + "\n\n";
	// Add a separator for references
	prompt += "---\n\n\n";
	// Add references section
	prompt += "---\n### References:\n\n";
	references.forEach((ref, i) => {
		prompt += `${i + 1}. ${ref.title}\n\`\`\`\n${ref.content}\n\`\`\`\n\n`;
	});
	// Add the user query section
	prompt += `---\n# Query:\n\n${user}\n\n---`;

	return prompt;
};

const promptAPISession = async (topK: number, temperature: number) => {
	const abort_controller = new AbortController();
	const capabilities = await window.ai.languageModel.capabilities();
	const aisession = await window.ai.languageModel.create({
		topK: Math.min(topK, capabilities.defaultTopK),
		temperature: temperature,
		signal: abort_controller.signal,
	});
	return { aisession, capabilities, abort_controller };
};

interface InferPromptAgentProps {
	agent: Agent;
	user_msg: MessageHeadProps;
	onStart?: (agent_name: string) => void;
	onUpdate?: (chunk: string) => void;
	onFinish?: () => void;
	onError?: (error: any) => void;
}

const inferPromptAgent = async ({ agent, user_msg, onStart, onUpdate, onFinish, onError }: InferPromptAgentProps) => {
	try {
		console.log("1");
		const { aisession } = await promptAPISession(agent.topK, agent.temperature);
		const prompt = createPrompt(agent.systemPrompt, user_msg.references, user_msg.content);
		console.log("2");
		const chunks = aisession.promptStreaming(prompt);
		console.log("3. ", prompt);
		onStart ? onStart(agent.name) : null; // triggers an add message callback with bot's name
		for await (const chunk of chunks) {
			onUpdate ? onUpdate(chunk) : null //updates the message contents
			console.log("4. ", chunk);
		}
		onFinish ? onFinish() : null;
		aisession.destroy();
	} catch (error) {
		onError ? onError(error) : null;
	}
};

export interface UseAgentHookProps {
	user_msg: MessageHeadProps;
	agents: Agent[];
	onStart: (agent_name: string) => void;
	onUpdate: (chunk: string) => void;
	onFinish?: () => void;
	onError?: (error: Error) => void;
}


export const getDefaultAgnet  = (systemPrompt : string) : Agent => {
	return {
		name : "Assistant",
		type : AgentType.PROMPT,
		description:"Generalist",
		systemPrompt : systemPrompt,
		temperature : 0.5,
		topK : 5
	}
}

export const useAgent = async ({ user_msg, agents, onStart, onUpdate, onFinish, onError }: UseAgentHookProps) => {
	const agent_name = extractFirstAtWord(user_msg.content);
	console.log("agent name  ", agent_name);
	if (agent_name == null) {
		//default
		console.log("agent name is ", agent_name);
		const agent = getDefaultAgnet("You are a generalist assistant who can help to answer to the given user's query precisely.");
		inferPromptAgent({
					agent,
					user_msg,
					onStart,
					onFinish,
					onUpdate,
					onError
				})
				return;
		return;
	}
	const targetAgent = agents.find((agent) => agent.name.trim() === agent_name) 
	if (targetAgent != undefined) {
		console.log("agent name is ", agent_name);
		// has agent
		const agent = targetAgent;
		switch (agent?.type) {
			case AgentType.PROMPT: {
				inferPromptAgent({
					agent,
					user_msg,
					onStart,
					onFinish,
					onUpdate,
					onError
				})
				return;
			}

			case AgentType.SUMMARIZATION: {
				const { aisession } = await promptAPISession(agent.topK, agent.temperature);
				const prompt = "";
				break;
			}

			case AgentType.WRITER:
				break;

			case AgentType.REWRITER:
				break;
		}
	}
	console.log("no agent found");
};
