import { EventMessage } from "@/base/types";
import { NotifyMeActions, TargetContent } from "./types";
import { elementToXPath } from "./scripts/xPathUtils";
import { ElementSelector } from "./scripts/handleElementSelection";


const elementpicker = new ElementSelector();

function initNotifyMe() {
	console.log("notify me init");
	chrome.runtime.onMessage.addListener((message: EventMessage, sender: chrome.runtime.MessageSender, sendResponse) => {
		switch (message.action) {
			case NotifyMeActions.ENABLE_TARGET_SELECTION:
				_onTargetSelectionEnable(message, sender, sendResponse);
				break;
			case NotifyMeActions.DISABLE_TARGET_SELECTION:
				_onTargetSelectionDisable(message, sender, sendResponse);
				break;
		}
	});
}

initNotifyMe()

function _onTargetSelectionEnable(message: EventMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
	console.log("enable selection");
	elementpicker.enableSelection((element) => {
		const response: TargetContent = {
			url: window.location.href,
			title: document.title,
			content: element.innerText.replace("\n\n", "").trim(),
			xpath: elementToXPath(element),
		};
		chrome.runtime.sendMessage({ action: NotifyMeActions.TARGET_CONTENT, value: response });
	});
	sendResponse(true);
}

function _onTargetSelectionDisable(message: EventMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
	elementpicker.disableSelection();
	sendResponse(true);
}

export default initNotifyMe;
