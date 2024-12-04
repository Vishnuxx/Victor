import { Agent } from "../types";

class AgentStore {
	private storageKey = "victor.agentStore";

	// Retrieve an agent by name
	async getAgent(name: string): Promise<Agent | null> {
		const result = await chrome.storage.local.get(this.storageKey);
		const agents: Agent[] = result[this.storageKey] || [];
		return agents.find((agent) => agent.name === name) || null;
	}

	// Add a new agent to the storage
	async addAgent(agent: Agent): Promise<void> {
		const result = await chrome.storage.local.get(this.storageKey);
		const agents: Agent[] = result[this.storageKey] || [];
        const duplicate = agents.filter((dupe) => dupe.name == agent.name);
        if(duplicate.length > 0) return
		agents.push(agent);
		await chrome.storage.local.set({ [this.storageKey]: agents });
	}

	// Delete an agent by name
	async deleteAgent(agent_name: string): Promise<boolean> {
		const result = await chrome.storage.local.get(this.storageKey);
		let agents: Agent[] = result[this.storageKey] || [];
		const initialLength = agents.length;
		agents = agents.filter((agent) => agent.name !== agent_name);
		await chrome.storage.local.set({ [this.storageKey]: agents });
		return agents.length < initialLength; // Return true if an agent was deleted
	}

	// Check if an agent exists by name
	async hasAgent(name: string): Promise<boolean> {
		const result = await chrome.storage.local.get(this.storageKey);
		const agents: Agent[] = result[this.storageKey] || [];
		return agents.some((agent) => agent.name === name);
	}

	// Get all agents
	async getAllAgents(): Promise<Agent[]> {
		const result = await chrome.storage.local.get(this.storageKey);
		const agents: Agent[] = result[this.storageKey] || [];
		return agents;
	}

	// Delete all agents
	async deleteAllAgents(): Promise<void> {
		await chrome.storage.local.remove(this.storageKey); // Remove the entire storage key
	}

	// Update properties of an existing agent by name
	async updateAgent(name: string, props: Partial<Omit<Agent, "name">>): Promise<boolean> {
		const result = await chrome.storage.local.get(this.storageKey);
		let agents: Agent[] = result[this.storageKey] || [];

		const index = agents.findIndex((agent) => agent.name === name);
		if (index === -1) {
			return false; // Agent not found
		}

		// Update the agent's properties
		agents[index] = { ...agents[index], ...props };
		await chrome.storage.local.set({ [this.storageKey]: agents });
		return true; // Indicate that the update was successful
	}
}

export default AgentStore;
