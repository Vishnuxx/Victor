import { Agent, AgentType } from "@/pages/sidebar/Chat/types";

function extractFirstAtWord(str: string) {
	const trimmedStr = str.trim();
	const words = trimmedStr.split(/\s+/);
	const starts = words[0].startsWith("@");
	return starts ? words[0].slice(1, words[0].length) : null;
}

const createPrompt = (system: string, context: string, user: string) => {
	// Initialize the prompt with the system prompt section
	let prompt = "---\n# System Prompt:\n\n";
	prompt += system + "\n\n";
	// Add a separator for references
	prompt += "---\n\n\n";
	// Add context section
	prompt += "---\n### Context:\n\n";
	prompt += `${context}\n\`\`\`\n\n`;
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

interface InferQickPromptAgentProps {
	agent: Agent;
	context: string;
	query: string;
	onStart?: (agent_name: string) => void;
	onUpdate?: (chunk: string) => void;
	onFinish?: () => void;
	onError?: (error: any) => void;
}

const inferQuickPromptAgent = async ({ agent, context, query, onStart, onUpdate, onFinish, onError }: InferQickPromptAgentProps) => {
	try {
		console.log("1");
		const { aisession } = await promptAPISession(agent.topK, agent.temperature);
		const prompt = createPrompt(agent.systemPrompt, context, query);
		console.log("2");
		const chunks = aisession.promptStreaming(prompt);
		console.log("3. ", prompt);
		onStart ? onStart(agent.name) : null; // triggers an add message callback with bot's name
		for await (const chunk of chunks) {
			onUpdate ? onUpdate(chunk) : null; //updates the message contents
			console.log("4. ", chunk);
		}
		onFinish ? onFinish() : null;
		aisession.destroy();
	} catch (error) {
		onError ? onError(error) : null;
	}
};

const getDefaultAgnet = (systemPrompt: string): Agent => {
	return {
		name: "Assistant",
		type: AgentType.PROMPT,
		description: "Generalist",
		systemPrompt: systemPrompt,
		temperature: 0.5,
		topK: 5,
	};
};

interface UseAgentHookProps {
	agents: Agent[];
	context: string;
	query: string;
	onStart: (agent_name: string) => void;
	onUpdate: (chunk: string) => void;
	onFinish?: () => void;
	onError?: (error: Error) => void;
}

export const useQuickAgent = async ({ context, query, agents, onStart, onUpdate, onFinish, onError }: UseAgentHookProps) => {
	const agent_name = extractFirstAtWord(query);
	console.log("agent name  ", agent_name);
	if (agent_name == null) {
		//default
		console.log("choosing default agent")
		const agent = getDefaultAgnet(
			`
          Act as a question answer bot. 
          Provide only direct answer to the user's query. 
          User may ask queries that can be used for browsing, writing in markdown, or writing code snippets.
          Do not respond as a bot or give your opinion. Only give the answers directly.
        `.trim()
		);
		inferQuickPromptAgent({
			agent,
			context,
			query,
			onStart,
			onFinish,
			onUpdate,
			onError,
		});
		return;
	}
	const targetAgent = agents.find((agent) => agent.name.trim() === agent_name);
	if (targetAgent != undefined) {
        
		// has agent
		const agent = targetAgent;
        console.log("query is : " , query.slice(agent.name.length + 1 , query.length))
		inferQuickPromptAgent({
			agent,
			context,
			query,
			onStart,
			onFinish,
			onUpdate,
			onError,
		});
		return;
	}
	console.log("no agent found");
};
