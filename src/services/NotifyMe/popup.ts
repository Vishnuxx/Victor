import { EventMessage } from "@/base/types";
import { NotifyMeActions, TargetContent } from "./types";
// import initNotifyMe from "./content";




export function enableTargetSelection() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs[0]?.id) {
			// chrome.scripting.executeScript({
			// 	target: { tabId: tabs[0].id },
			// 	func: initNotifyMe,
			// });
			chrome.tabs.sendMessage(tabs[0].id, { action: NotifyMeActions.ENABLE_TARGET_SELECTION, value: true }, (response) => {
				
			});
		}
	});
}

export function disableTargetSelection() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs[0].id) {
			chrome.tabs.sendMessage(tabs[0].id, { action: NotifyMeActions.DISABLE_TARGET_SELECTION, value: true } , (response)=>{
				
			});
		}
	});
}


export function onReceiveTargetContent(callback : (content : TargetContent | null) => void) {
	chrome.runtime.onMessage.addListener((message: EventMessage, sender: chrome.runtime.MessageSender, sendResponse) => {
		if (message.action == NotifyMeActions.TARGET_CONTENT) {
			const targetContent : TargetContent = message.value
			console.log(targetContent)
			callback(targetContent);
		}
	})
}


