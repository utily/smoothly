import { isoly } from "isoly"
import { tidily } from "tidily"
import { getAdjacentWordBreakIndex } from "./adjacentWordBreak"

type Formatter = tidily.Formatter & tidily.Converter<any>
type EventHandler = (event: InputEvent, unformatted: tidily.State, formatted: tidily.State) => tidily.State

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

	public onEvent(event: InputEvent, state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		const unformatted = this.unformattedState(this.updateSelectionFromElement(event.target as HTMLInputElement, state))
		const result =
			event.type == "beforeinput" || event.type == "input"
				? this.eventHandlers[event.type][event.inputType]?.(event, unformatted, state) ?? state
				: state
		const formatted = this.formatState(result)
		const input = event.target as HTMLInputElement
		if (event.defaultPrevented) {
			input.value = formatted.value
			input.selectionStart = formatted.selection.start
			input.selectionEnd = formatted.selection.end
			input.selectionDirection = formatted.selection.direction ?? null
		}
		return formatted
	}
	private eventHandlers: Record<"beforeinput" | "input", { [inputType: string]: EventHandler | undefined }> = {
		beforeinput: {
			insertText: (event, state) => {
				event.preventDefault()
				if (typeof event.data == "string")
					for (const c of event.data)
						this.formatter.allowed(c, state) && this.replace(state, c)
				return state
			},
			insertFromPaste: (event, state) => {
				event.preventDefault()
				if (typeof event.data == "string")
					for (const c of event.data)
						this.formatter.allowed(c, state) && this.replace(state, c)
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
				// TODO - exception for password
				event.preventDefault()
				return this.deleteWord(formattedState, "backward")
			},
			deleteWordForward: (event, _, formattedState) => {
				// TODO - exception for password
				event.preventDefault()
				return this.deleteWord(formattedState, "forward")
			},
			deleteByCut: (_, state) => {
				this.erase(state)
				return state
			},
			// insertFromDrop - TODO
			// historyUndo - TODO
			// historyRedo - TODO
			// insertLineBreak - TODO
		},
		input: {
			insertReplacementText: (event, state) => ({ ...state, value: (event.target as HTMLInputElement).value }),
			insertCompositionText: (event, state) => ({ ...state, value: (event.target as HTMLInputElement).value }),
		},
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

	public updateSelectionFromElement(input: HTMLInputElement, state: tidily.State) {
		return this.createState({
			value: state.value,
			selection: {
				start: input.selectionStart ?? 0,
				end: input.selectionEnd ?? 0,
				direction: input.selectionDirection ?? undefined,
			},
		})
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

	public unformattedState(formattedState: tidily.State) {
		return tidily.State.copy(this.formatter.unformat(tidily.StateEditor.copy(formattedState)))
	}
	public formatState(unformattedState: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(unformattedState))
	}
	public createState(state: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy(state))))
	}
}
