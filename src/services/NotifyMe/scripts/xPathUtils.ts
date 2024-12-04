
export function elementToXPath(element: HTMLElement): string {
	if (!(element instanceof HTMLElement)) {
		throw new Error("Provided node is not an HTMLElement.");
	}

	let xpath = "";
	let current: HTMLElement | null = element;

	while (current && current.nodeType === Node.ELEMENT_NODE) {
		const tagName = current.tagName.toLowerCase();
		let index = 1; // XPath indices are 1-based

		// Calculate index within siblings of the same tag name
		let sibling: ChildNode | null = current.previousSibling;
		while (sibling) {
			if (sibling.nodeType === Node.ELEMENT_NODE && (sibling as HTMLElement).tagName.toLowerCase() === tagName) {
				index++;
			}
			sibling = sibling.previousSibling;
		}

		const segment = `${tagName}[${index}]`;
		xpath = `/${segment}${xpath}`;
		current = current.parentElement;
	}

	return xpath;
}


export function findElementByXPath(xpath: string, contextNode: Document | HTMLElement = document): HTMLElement | null {
	const result = document.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	return result.singleNodeValue as HTMLElement | null;
}
