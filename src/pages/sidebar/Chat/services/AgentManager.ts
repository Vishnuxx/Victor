import { Agent, MessageHeadProps } from "../types";
import { extractResult } from "./utils";

// handles storing and retrieving agents
class AgentManager {
	agents: Map<string, Agent>;
	constructor() {
		this.agents = new Map();
	}

	getAgent(name : string) : Agent | null{
		if (this.hasAgent(name)) {
			return this.agents.get(name.trim().toLowerCase())!;
		}
		return null
	}

    addAgent(agent : Agent) {
        this.agents.set(agent.name.trim().toLowerCase(), agent)
    }

    deleteAgent(agent_name : string) : boolean {
        return this.agents.delete(agent_name);
    }

	hasAgent(name: string): boolean {
		return this.agents.get(name.trim().toLowerCase()) != undefined;
	}

	listAgentsAsMarkdown() {
		let markdown = "# Agents:\n";
		this.agents.forEach((agent, name) => {
			markdown += `  - **name** : ${name}\n`;
			markdown += `    **description : ${agent.description}\n\n`;
		});
		return markdown;
	}

    
}

export default AgentManager;
