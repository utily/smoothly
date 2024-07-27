import { tidily } from "tidily"

type Formatter = tidily.Formatter & tidily.Converter<any>

export namespace Action {
	export function insertText(formatter: Formatter, state: tidily.State, insertString: string) {
		const result = unformattedState(formatter, state)
		if (formatter.allowed(insertString, result)) {
			replace(result, insertString)
		}
		return formatter.format(tidily.StateEditor.copy(result))
	}
	export function deleteContentBackward(formatter: Formatter, state: tidily.State) {
		const result = unformattedState(formatter, state)
		if (result.selection.start == result.selection.end)
			select(result, result.selection.start - 1, result.selection.end)
		erase(result)
		return formatState(formatter, result)
	}
	export function deleteContentForward(formatter: Formatter, state: tidily.State) {}
	export function deleteWordBackward(formatter: Formatter, state: tidily.State) {}
	export function deleteWordForward(formatter: Formatter, state: tidily.State) {}
	export function insertFromPaste(formatter: Formatter, state: tidily.State) {}

	export function unformattedState(formatter: Formatter, formattedState: tidily.State) {
		return tidily.State.copy(formatter.unformat(tidily.StateEditor.copy(formattedState)))
	}
	export function formatState(formatter: Formatter, unformattedState: tidily.State) {
		return formatter.format(tidily.StateEditor.copy(unformattedState))
	}

	export function select(state: tidily.State, from: number, to: number, direction?: tidily.Direction): void {
		state.selection.start = from
		state.selection.end = to
		direction && (state.selection.direction = direction)
	}

	function erase(state: tidily.State): void {
		replace(state, "")
	}
	function replace(state: tidily.State, insertString: string) {
		state.value =
			state.value.substring(0, state.selection.start) + insertString + state.value.substring(state.selection.end)
		state.selection.start = state.selection.start + insertString.length
		state.selection.end = state.selection.start
	}

	export function newState(formatter: Formatter, state: tidily.State) {
		return formatter.format(tidily.StateEditor.copy(formatter.unformat(tidily.StateEditor.copy(state))))
	}
}
