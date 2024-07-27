import { isoly } from "isoly"
import { tidily } from "tidily"
import { getAdjacentWordBreakIndex } from "./adjecentWordBreak"

type Formatter = tidily.Formatter & tidily.Converter<any>

export class Action {
	constructor(private formatter: Formatter) {}
	static create(type: "price", currency?: isoly.Currency): Action
	static create(type: tidily.Type, locale?: isoly.Locale): Action
	static create(type: tidily.Type, extra?: any): Action {
		let result: (tidily.Formatter & tidily.Converter<any>) | undefined
		switch (type) {
			case "price":
				result = tidily.get("price", extra)
				break
			default:
				result = tidily.get(type, extra)
				break
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return new Action(result || tidily.get("text")!)
	}
	public onBeforeInput(event: InputEvent, state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		const unformatted = this.unformattedState(state)
		const result = this.beforeInputEventHandlers[event.inputType]?.(event, unformatted, state) ?? state
		return this.formatState(result)
	}

	private beforeInputEventHandlers: {
		[inputType: string]:
			| ((event: InputEvent, unformatted: tidily.State, formatted: tidily.State) => tidily.State)
			| undefined
	} = {
		insertText: (event, state) => {
			event.preventDefault()
			const insertString = event.data
			if (typeof insertString == "string" && this.formatter.allowed(insertString, state)) {
				this.replace(state, insertString)
			}
			return state
		},
		deleteContentBackward: (event, state) => {
			event.preventDefault()
			if (state.selection.start == state.selection.end)
				this.select(state, state.selection.start - 1, state.selection.end)
			this.erase(state)
			return state
		},
		deleteContentForward: (event, state) => {
			event.preventDefault()
			if (state.selection.start == state.selection.end)
				this.select(state, state.selection.start, state.selection.end + 1)
			this.erase(state)
			return state
		},
		deleteWordBackward: (event, _, formattedState) => {
			event.preventDefault()
			return this.deleteWord(formattedState, "backward")
		},
		deleteWordForward: (event, _, formattedState) => {
			event.preventDefault()
			return this.deleteWord(formattedState, "forward")
		},
		insertFromPaste: (event, state) => {
			event.preventDefault()
			if (typeof event.data == "string") {
				this.replace(state, event.data)
			}
			return state
		},
		// deleteByCut - TODO
		// insertReplacementText - TODO
		// insertCompositionText - TODO
		// insertFromDrop - TODO
		// historyUndo - TODO
		// historyRedo - TODO
	}

	private deleteWord(formattedState: tidily.State, direction: "backward" | "forward") {
		const cursorPosition = tidily.Selection.getCursor(formattedState.selection)
		const adjacentIndex = getAdjacentWordBreakIndex(formattedState.value, cursorPosition, direction)
		const result = this.unformattedState({
			...formattedState,
			selection: {
				start: Math.min(cursorPosition, adjacentIndex),
				end: Math.max(cursorPosition, adjacentIndex),
				direction: "none",
			},
		})
		result.value = result.value.substring(0, result.selection.start) + result.value.substring(result.selection.end)
		result.selection.end = result.selection.start
		return result
	}

	public insertFromPaste(state: tidily.State) {}

	public unformattedState(formattedState: tidily.State) {
		return tidily.State.copy(this.formatter.unformat(tidily.StateEditor.copy(formattedState)))
	}
	public formatState(unformattedState: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(unformattedState))
	}

	private select(state: tidily.State, from: number, to: number, direction?: tidily.Direction): void {
		state.selection.start = from
		state.selection.end = to
		direction && (state.selection.direction = direction)
	}

	private erase(state: tidily.State): void {
		this.replace(state, "")
	}
	private replace(state: tidily.State, insertString: string) {
		state.value =
			state.value.substring(0, state.selection.start) + insertString + state.value.substring(state.selection.end)
		state.selection.start = state.selection.start + insertString.length
		state.selection.end = state.selection.start
	}

	public createState(state: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy(state))))
	}
}
