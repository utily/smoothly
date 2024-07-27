import { tidily } from "tidily"

type Formatter = tidily.Formatter & tidily.Converter<any>

export namespace Action {
	export function insertText(formatter: Formatter, state: tidily.State, insertString: string) {
		if (formatter.allowed(insertString, state)) {
			replace(state, insertString)
		}
		return formatter.format(tidily.StateEditor.copy(state))
	}
	export function deleteContentForward(formatter: Formatter, state: tidily.State) {}
	export function deleteContentBackward(formatter: Formatter, state: tidily.State) {}
	export function deleteWordForward(formatter: Formatter, state: tidily.State) {}
	export function deleteWordBackward(formatter: Formatter, state: tidily.State) {}

	export function replace(state: tidily.State, insertString: string) {
		state.value =
			state.value.substring(0, state.selection.start) + insertString + state.value.substring(state.selection.end)
		state.selection.start = state.selection.start + insertString.length
		state.selection.end = state.selection.start
	}

	export function newState(formatter: Formatter, state: tidily.State) {
		return formatter.format(tidily.StateEditor.copy(formatter.unformat(tidily.StateEditor.copy(state))))
	}
}
