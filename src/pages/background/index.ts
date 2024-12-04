import { ContextMenuItems, EventMessage } from "@/base/types";
import EmbeddingModel from "@/pages/background/embeddings";


async function init() {
	const embeding = new EmbeddingModel();
	await embeding.init()
	// const emb1 = await embeding.generateEmbeddings(["This is a cat "])
	const simscore = await embeding.similarityScore("this a cat", "this is a dog")
	console.log(simscore);
	const emb2 = await embeding.generateEmbeddings(["Man is happy", "cats are cute"]);
	const retrieved = await embeding.retrieve("This is a cat", emb2! , 10 , 0.1);
	console.log(retrieved)

}



chrome.runtime.onInstalled.addListener((details) => {
	chrome.contextMenus.create({
		id: ContextMenuItems.ASK,
		title: "Ask",
		contexts: ["selection" , "editable"],
	});
	// chrome.contextMenus.create({
	// 	id: ContextMenuItems.TRANSLATE,
	// 	title: "ChromeAI-Translate",
	// 	contexts: ["selection"],
	// });
	// chrome.contextMenus.create({
	// 	id: ContextMenuItems.SUMMARISE,
	// 	title: "Summarise",
	// 	contexts: ["selection"],
	// });
	// chrome.contextMenus.create({
	// 	id: ContextMenuItems.WRITE,
	// 	title: "ChromeAI-Write",
	// 	contexts: ["editable"],
	// });
	// chrome.contextMenus.create({
	// 	id: ContextMenuItems.REWRITE,
	// 	title: "ChromeAI-Rewrite",
	// 	contexts: ["editable"],
	// });

	init().then(() => {
		console.log("success");
	});
});


chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
	switch (info.menuItemId) {
		case ContextMenuItems.ASK:
			chrome.tabs.query({currentWindow: true , active : true} , (tabs : chrome.tabs.Tab[])=>{
				// if (tabs.length < 1) return
				const message : EventMessage = {
					action : ContextMenuItems.ASK,
					message : info
				}
				chrome.tabs.sendMessage(tabs[0].id , message , (response : EventMessage) => {
					console.log("sent")
				} )
			})
			
			break;
	}
});


async function ini() {
	const session = await ai.languageModel.create();

	const chunks = await session.promptStreaming("hello there");
	for (const chunk of chunks) {

		console.log(chunk)
	}
}

ini().then()