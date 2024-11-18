import { Direction, Formatter, Selection, Settings, State, StateEditor } from "tidily"
import { Adjacent } from "./Adjacent"

export interface Action {
	key: string
	repeat?: boolean
	ctrlKey?: boolean
	shiftKey?: boolean
	altKey?: boolean
	metaKey?: boolean
}

export namespace Action {
	export function apply(
		formatter: Formatter,
		state: Readonly<State>,
		formatted: "formatted" | "partial",
		action?: Action
	): Readonly<State> & Readonly<Settings> {
		let result = State.copy(formatter.unformat(StateEditor.copy(state)))

		if ((state as any).autocomplete == "cc-exp" && /^\d\d \/$/g.test(state.value))
			action?.key && (action.key = "Backspace")
		if (action) {
			if (action.ctrlKey || action.metaKey) {
				if (action.key == "a")
					select(result, 0, result.value.length, "forward")
				else if (["ArrowLeft", "ArrowRight"].includes(action.key) && (state as any)?.type != "password")
					result = ctrlArrow(formatter, state, action)
				else if (["Delete", "Backspace"].includes(action.key) && (state as any)?.type != "password")
					result = ctrlRemove(formatter, state, action)
			} else if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(action.key))
				arrowHomeEnd(result, action)
			else if (["Delete", "Backspace"].includes(action.key)) {
				result.selection.start == result.selection.end &&
					select(
						result,
						result.selection.start + (action.key == "Backspace" ? -1 : 0),
						result.selection.end + (action.key == "Delete" ? 1 : 0)
					)
				erase(result)
			} else if (action.key != "Unidentified") {
				erase(result)
				formatter.allowed(action.key, result) && replace(result, action.key)
			}
		}
		return formatted == "formatted"
			? formatter.format(StateEditor.copy(result))
			: formatter.partialFormat(StateEditor.copy(result))
	}

	export function paste(
		formatter: Formatter,
		state: Readonly<State>,
		formatted: "formatted" | "partial",
		pasted: string
	) {
		const result = State.copy(formatter.unformat(StateEditor.copy(state)))
		replace(result, pasted)
		return formatted == "formatted"
			? formatter.format(StateEditor.copy(result))
			: formatter.partialFormat(StateEditor.copy(result))
	}

	function ctrlArrow(formatter: Formatter, state: Readonly<State>, action: Action): Readonly<State> {
		let cursorPosition = Selection.getCursor(state.selection)
		let stalkPosition = Selection.getStalker(state.selection)
		cursorPosition = Adjacent.getWordBreakIndex(
			state.value,
			cursorPosition,
			action.key == "ArrowLeft" ? "backward" : "forward"
		)
		stalkPosition = action.shiftKey ? stalkPosition : cursorPosition
		return State.copy(
			formatter.unformat(
				StateEditor.copy({
					...state,
					selection: {
						start: Math.min(stalkPosition, cursorPosition),
						end: Math.max(stalkPosition, cursorPosition),
						direction:
							stalkPosition < cursorPosition ? "forward" : stalkPosition > cursorPosition ? "backward" : "none",
					},
				})
			)
		)
	}
	function ctrlRemove(formatter: Formatter, state: Readonly<State>, action: Action): Readonly<State> {
		const cursorPosition = Selection.getCursor(state.selection)
		const adjacentIndex = Adjacent.getWordBreakIndex(
			state.value,
			cursorPosition,
			action.key == "Backspace" ? "backward" : "forward"
		)
		const result = State.copy(
			formatter.unformat(
				StateEditor.copy({
					...state,
					selection: {
						start: Math.min(cursorPosition, adjacentIndex),
						end: Math.max(cursorPosition, adjacentIndex),
						direction: "none",
					},
				})
			)
		)
		result.value = result.value.substring(0, result.selection.start) + result.value.substring(result.selection.end)
		result.selection.end = result.selection.start
		return result
	}
	function arrowHomeEnd(state: State, action: Action) {
		let cursorPosition = Selection.getCursor(state.selection)
		let stalkPosition = Selection.getStalker(state.selection)
		cursorPosition =
			action.key == "Home"
				? 0
				: action.key == "End"
				? state.value.length
				: state.selection.start == state.selection.end || action.shiftKey
				? Math.min(Math.max(cursorPosition + (action.key == "ArrowLeft" ? -1 : 1), 0), state.value.length)
				: action.key == "ArrowLeft"
				? state.selection.start
				: state.selection.end
		stalkPosition = action.shiftKey ? stalkPosition : cursorPosition
		state.selection.direction =
			stalkPosition < cursorPosition ? "forward" : stalkPosition > cursorPosition ? "backward" : "none"
		state.selection.start = Math.min(stalkPosition, cursorPosition)
		state.selection.end = Math.max(stalkPosition, cursorPosition)
	}
	function select(state: State, from: number, to: number, direction?: Direction): void {
		state.selection.start = from
		state.selection.end = to
		direction && (state.selection.direction = direction)
	}
	function erase(state: State): void {
		replace(state, "")
	}
	function replace(state: State, insertString: string): void {
		state.value =
			state.value.substring(0, state.selection.start) + insertString + state.value.substring(state.selection.end)
		state.selection.start = state.selection.start + insertString.length
		state.selection.end = state.selection.start
	}
}
