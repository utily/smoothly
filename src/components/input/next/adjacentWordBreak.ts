function getForwardWordBreakIndex(str: string, index: number, wordRegex: RegExp): number {
	let result = 0
	while (wordRegex.exec(str) != null) {
		result = wordRegex.lastIndex
		if (wordRegex.lastIndex > index)
			break
	}
	wordRegex.lastIndex <= index && (result = str.length)
	return result
}

function getBackwardWordBreakIndex(str: string, index: number, wordRegex: RegExp): number {
	let result = 0
	let execArray: RegExpExecArray | null
	while ((execArray = wordRegex.exec(str)) != null) {
		if (wordRegex.lastIndex - execArray[0].length < index)
			result = wordRegex.lastIndex - execArray[0].length
		else
			break
	}
	return result
}

export function getAdjacentWordBreakIndex(str: string, index: number, direction: "backward" | "forward"): number {
	const wordRegex = /([\wåäöüéáúíóßðœøæñµçþ_]+|[@-]+)/gi
	return direction == "backward"
		? getBackwardWordBreakIndex(str, index, wordRegex)
		: getForwardWordBreakIndex(str, index, wordRegex)
}
