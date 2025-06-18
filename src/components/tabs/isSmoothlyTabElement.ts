export function isSmoothlyTabElement(element: any): element is HTMLSmoothlyTabElement {
	return element?.tagName == "SMOOTHLY-TAB"
}
