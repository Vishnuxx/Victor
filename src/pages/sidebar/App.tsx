import { MemoryRouter, Route, Routes } from "react-router";
import AgentBuilder from "./AgentBuilder/AgentBuilder";
import ChatScreen from "./Chat/Chat";
import TestChat from "./Chat/tests/trestChat";
import RewriterAssistant from "./RewriterAssistant/RewriterAssistant";
import "./style.css"
import { AgentListingPage } from "./AgentBuilder/AgentListingPage";
import { AgentCreator } from "./AgentBuilder/AgentCreationPage";


function App () {
	

	return (
		<div className="h-full w-full text-white bg-[#191919]">
			<MemoryRouter>
				<Routes>
					<Route path="/" element={ <ChatScreen /> } />
					<Route path="/agents" element={ <AgentListingPage /> } />
					<Route path="/agent_creator" element={ <AgentCreator /> } />
				</Routes>
				
			</MemoryRouter>
			
		</div>
	);
}

export default App;
