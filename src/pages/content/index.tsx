import { createRoot } from "react-dom/client";
import { ChakraProvider, createSystem, defineConfig } from "@chakra-ui/react";
import "./style.css";
import App from "./App";


const div = document.createElement("div");
div.id = "__root";
div.className = "fixed w-0 h-0";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);

const config = defineConfig({
	theme: {
		tokens: {
			colors: {},
		},
	},
});

const system = createSystem(config);

root.render(
	<>
		<ChakraProvider value={system}>
			<App />
			{/* <FloatingBubble window={window}/> */}
			
		</ChakraProvider>
	</>
);
