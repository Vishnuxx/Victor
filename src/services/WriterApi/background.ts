import { EventMessage } from "@/base/types";
import { NotifyMeActions } from "../NotifyMe/types";

chrome.runtime.onMessage.addListener((message: EventMessage, sender: chrome.runtime.MessageSender, sendResponse) => {
	if (message.action == NotifyMeActions.TARGET_CONTENT) {
		const targetContent: TargetContent = message.value;
		console.log(targetContent);
		callback(targetContent);
	}
});
