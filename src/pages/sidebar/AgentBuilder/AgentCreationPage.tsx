import { ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Agent, AgentType } from "../Chat/types";
import AgentStore from "../Chat/services/AgentStore";

export const AgentCreator = () => {
    const agentStore = useRef(new AgentStore());
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { agent, is_new_agent }: { agent: Agent, is_new_agent: boolean } = state;
    const [agentState, setAgentState] = useState<Agent>(!is_new_agent ? agent : {
        name: "",
        type: AgentType.PROMPT,
        description: "", systemPrompt: "", topK: 4, temperature: 0.8
    });

    // Function to handle input changes
    const handleInputChange = (field: keyof Agent) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAgentState({ ...agentState, [field]: e.target.value });
    };

    // Function to save changes
    const handleSave = async () => {
        // Logic to save the agent (e.g., API call)
        if(is_new_agent) {
            await agentStore.current.addAgent(agentState)
        } else {
            await agentStore.current.updateAgent(agentState.name, agentState)
        }
        
        console.log("Saving agent:", agentState);
        navigate(-1); // Navigate back after saving
    };

    return (
        <div className="p-6 rounded-lg h-full w-full flex flex-col">
            <div className="w-full flex flex-row items-center">
                <ChevronLeft onClick={ () => navigate(-1) } />
                <h2 className="text-xl font-bold flex ml-2">Agent or</h2>
                <button
                    onClick={ handleSave }
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Save
                </button>
            </div>

            <div className="space-y-4 h-full flex flex-col mt-4">
                <div>
                    <label htmlFor="agentName" className="block text-gray-400 mb-1">Agent Name</label>
                    <input
                        type="text"
                        disabled={ !is_new_agent } // Disable if ing
                        id="agentName"
                        className="bg-gray-800 text-white px-4 py-2 rounded-md w-full"
                        value={ agentState.name }
                        onChange={ handleInputChange("name") }
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-gray-400 mb-1">Description</label>
                    <input
                        type="text"
                        id="description"
                        className="bg-gray-800 text-white px-4 py-2 rounded-md w-full"
                        value={ agentState.description }
                        onChange={ handleInputChange("description") }
                    />
                </div>
                <div>
                    <label htmlFor="systemPrompt" className="block text-gray-400 mb-1">System Prompt</label>
                    <textarea
                        id="systemPrompt"
                        className="w-full p-2 bg-gray-800 rounded-[30px] text-white"
                        value={ agentState.systemPrompt }
                        onChange={ handleInputChange("systemPrompt") }
                    />
                </div>
                <div>
                    <label htmlFor="topK" className="block text-gray-400 mb-1">TopK</label>
                    <input
                        type="range"
                        min={ 1 }
                        max={ 10 }
                        id="topK"
                        className="w-full p-2 bg-gray-800 rounded-[30px] text-white"
                        value={ agentState.topK } // Assuming topK represents abilities for demonstration; adjust as needed
                        onChange={ handleInputChange("topK") } // Adjust as necessary for actual abilities input
                    />
                </div>
                <div>
                    <label htmlFor="temperature" className="block text-gray-400 mb-1">Temperature</label>
                    <input
                        type="range"
                        min={ 0 }
                        max={ 1 }
                        id="topK"
                        className="w-full p-2 bg-gray-800 rounded-[30px] text-white"
                        value={ agentState.temperature } // Assuming topK represents abilities for demonstration; adjust as needed
                        onChange={ handleInputChange("temperature") } // Adjust as necessary for actual abilities input
                    />
                </div>
            </div>

            <div className="flex flex-col items-center space-x-2 p-[2px] rounded-[30px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-0 mt-auto">
                <button className="bg-gray-900 w-full rounded-[30px] text-white px-4 py-2 transition-all duration-300 active:bg-black hover:bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    Create
                </button>
            </div>
        </div>
    );
};