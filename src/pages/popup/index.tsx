import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import "@assets/styles/tailwind.css";
import App from "./App";



function init() {
	const rootContainer = document.querySelector("#__root");
	if (!rootContainer) throw new Error("Can't find Popup root element");
	const root = createRoot(rootContainer);
	root.render(<App/>);
}

init();

// const btn = document.getElementById("sort");
// btn!.onclick = () => {
// 	chrome.runtime.sendMessage({ action: "sortTabs", side: "left", relative_time: 10 }, () => {
// 		alert("Options saved");
// 	});
// };
