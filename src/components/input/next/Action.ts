import { isoly } from "isoly"
import { tidily } from "tidily"
import { getAdjacentWordBreakIndex } from "./adjacentWordBreak"

type Formatter = tidily.Formatter & tidily.Converter<any>
type EventHandler = (event: InputEvent, unformatted: tidily.State, formatted: tidily.State) => tidily.State

/**
Alternative names:
- EventToStateHandler
- EventHandler
- InputStateManager
- InputHandler
- InputStateController
 */
export class Action {
	constructor(private formatter: Formatter, private type: tidily.Type) {}
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
		return new Action(result || tidily.get("text")!, type)
	}

	public onFocus(event: FocusEvent, state: tidily.State) {
		const result = this.partialFormatState(this.unformatState(state))
		const input = event.target as HTMLInputElement
		input.value = result.value
		return result
	}

	public onBlur(event: FocusEvent, state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		const result = this.createState(state)
		const input = event.target as HTMLInputElement
		input.value = result.value
		return result
	}

	public onInputEvent(event: InputEvent, state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		const input = event.target as HTMLInputElement
		state.selection.start = input.selectionStart ?? state.selection.start
		state.selection.end = input.selectionEnd ?? state.selection.end
		state.selection.direction = input.selectionDirection ?? state.selection.direction
		const unformatted = this.unformatState(state)
		const result =
			event.type == "beforeinput" || event.type == "input"
				? this.eventHandlers[event.type][event.inputType]?.(event, unformatted, state) ?? state
				: state
		const formatted = this.partialFormatState(result)
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
			insertText: (event, state) => this.insert(event, state),
			insertFromPaste: (event, state) => this.insert(event, state),
			insertFromDrop: (event, state) => this.insert(event, state),
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
			deleteWordBackward: (event, unformatted, formattedState) => {
				let result = unformatted
				if (this.type != "password") {
					event.preventDefault()
					result = this.deleteWord(formattedState, "backward")
				}
				return result
			},
			deleteWordForward: (event, unformatted, formattedState) => {
				let result = unformatted
				if (this.type != "password") {
					event.preventDefault()
					result = this.deleteWord(formattedState, "forward")
				}
				return result
			},
			deleteByCut: (_, state) => {
				this.erase(state)
				return state
			},
			// historyUndo - TODO
			// historyRedo - TODO
			// insertLineBreak - TODO
		},
		input: {
			insertReplacementText: (event, state) => ({ ...state, value: (event.target as HTMLInputElement).value }),
			insertCompositionText: (event, state) => ({ ...state, value: (event.target as HTMLInputElement).value }),
			deleteWordBackward: (event, state) =>
				this.type == "password" ? { ...state, value: (event.target as HTMLInputElement).value } : state,
			deleteWordForward: (event, state) =>
				this.type == "password" ? { ...state, value: (event.target as HTMLInputElement).value } : state,
		},
	}

	private insert(event: InputEvent, unformatted: tidily.State) {
		event.preventDefault()
		if (typeof event.data == "string")
			for (const c of event.data)
				this.formatter.allowed(c, unformatted) && this.replace(unformatted, c)
		return unformatted
	}
	private deleteWord(formattedState: tidily.State, direction: "backward" | "forward") {
		const cursorPosition = tidily.Selection.getCursor(formattedState.selection)
		const adjacentIndex = getAdjacentWordBreakIndex(formattedState.value, cursorPosition, direction)
		const result = this.unformatState({
			...formattedState,
			selection: {
				start: Math.min(cursorPosition, adjacentIndex),
				end: Math.max(cursorPosition, adjacentIndex),
				direction: "none",
			},
		})
		const value = result.value.substring(0, result.selection.start) + result.value.substring(result.selection.end)
		result.value = value
		result.selection.end = result.selection.start
		return result
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

	public unformatState(formattedState: tidily.State) {
		return tidily.State.copy(this.formatter.unformat(tidily.StateEditor.copy(formattedState)))
	}
	public partialFormatState(unformattedState: tidily.State) {
		return this.formatter.partialFormat(tidily.StateEditor.copy(unformattedState))
	}
	public formatState(unformattedState: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(unformattedState))
	}
	public createState(state: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy(state))))
	}
	public toString(value: any): string {
		return this.formatter.toString(value)
	}
	public setValue(
		formattedState: Readonly<tidily.State> & tidily.Settings,
		value: any
	): Readonly<tidily.State> & tidily.Settings {
		return {
			...formattedState,
			value: this.createState({ value: this.formatter.toString(value), selection: formattedState.selection }).value,
		}
	}
	public getValue(formattedState: tidily.State): any {
		return this.formatter.fromString(this.unformatState(formattedState).value)
	}
}
