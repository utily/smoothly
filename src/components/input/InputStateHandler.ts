import { isoly } from "isoly"
import { tidily } from "tidily"
import { Adjacent } from "./Adjacent"

type Formatter = tidily.Formatter & tidily.Converter<any>
type Handler<E extends Event> = (event: E, unformatted: tidily.State, formatted: tidily.State) => tidily.State

export class InputStateHandler {
	constructor(private formatter: Formatter, private type: tidily.Type) {}
	static create(type: "price", priceOptions: { currency?: isoly.Currency; toInteger?: boolean }): InputStateHandler
	static create(type: "integer", integerOptions: { min?: number; max?: number; pad?: number }): InputStateHandler
	static create(type: tidily.Type, locale?: isoly.Locale): InputStateHandler
	static create(type: tidily.Type, extra?: any): InputStateHandler {
		let result: (tidily.Formatter & tidily.Converter<any>) | undefined
		switch (type) {
			case "price":
				result = tidily.get("price", extra)
				break
			case "integer":
				result = tidily.get("integer", extra)
				break
			default:
				result = tidily.get(type, extra)
				break
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return new InputStateHandler(result || tidily.get("text")!, type)
	}

	public onKeyDown(
		event: KeyboardEvent,
		state: Readonly<tidily.State> & tidily.Settings
	): Readonly<tidily.State> & tidily.Settings {
		let result: Readonly<tidily.State> & tidily.Settings = state
		const handler = this.keydownHandlers[event.key]
		if (handler) {
			const input = event.target as HTMLInputElement
			state.selection.start = input.selectionStart ?? state.selection.start
			state.selection.end = input.selectionEnd ?? state.selection.end
			state.selection.direction = input.selectionDirection ?? state.selection.direction
			const unformatted = handler(event, this.unformatState(state), state)
			const formatted = this.partialFormatState(unformatted)
			if (event.defaultPrevented) {
				input.selectionStart = formatted.selection.start
				input.selectionEnd = formatted.selection.end
				input.selectionDirection = formatted.selection.direction ?? null
			}
			result = formatted
		}
		return result
	}
	keydownHandlers: { [key: string]: Handler<KeyboardEvent> | undefined } = {
		ArrowLeft: (event, state) => (event.ctrlKey || event.metaKey ? state : this.moveCursor(event, state)),
		ArrowRight: (event, state) => (event.ctrlKey || event.metaKey ? state : this.moveCursor(event, state)),
	}

	moveCursor(event: KeyboardEvent, state: tidily.State): tidily.State {
		event.preventDefault()
		let cursor = tidily.Selection.getCursor(state.selection)
		let stalk = tidily.Selection.getStalker(state.selection)
		cursor = Math.min(Math.max(cursor + (event.key == "ArrowLeft" ? -1 : 1), 0), state.value.length)
		stalk = event.shiftKey ? stalk : cursor
		state.selection.direction = stalk < cursor ? "forward" : stalk > cursor ? "backward" : "none"
		state.selection.start = Math.min(stalk, cursor)
		state.selection.end = Math.max(stalk, cursor)
		return state
	}

	public onFocus(event: FocusEvent, state: tidily.State) {
		const result = this.partialFormatState(this.unformatState(state))
		const input = event.target as HTMLInputElement
		input.value = result.value
		return result
	}

	public onBlur(event: FocusEvent, state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		const result = this.createFormattedState(state)
		const input = event.target as HTMLInputElement
		input.value = result.value
		return result
	}

	public onInputEvent(event: InputEvent, state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		const input = event.target as HTMLInputElement
		state.selection.start = input.selectionStart ?? state.selection.start
		state.selection.end = input.selectionEnd ?? state.selection.end
		state.selection.direction = input.selectionDirection ?? state.selection.direction
		const result =
			event.type == "beforeinput" || event.type == "input"
				? this.eventHandlers[event.type][event.inputType]?.(event, this.unformatState(state), state) ?? state
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
	private eventHandlers: Record<"beforeinput" | "input", { [inputType: string]: Handler<InputEvent> | undefined }> = {
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
			// Chrome will dispatch an input event without inputType when auto-filling
			undefined: (event, state) => ({ ...state, value: (event.target as HTMLInputElement).value }),
		},
	}

	private insert(event: InputEvent, unformatted: tidily.State): tidily.State {
		event.preventDefault()
		if (typeof event.data == "string")
			for (const c of event.data)
				this.formatter.allowed(c, unformatted) && this.replace(unformatted, c.replace(/(\r|\n|\t)/g, ""))
		return unformatted
	}
	private deleteWord(formattedState: tidily.State, direction: "backward" | "forward"): tidily.State {
		const cursorPosition = tidily.Selection.getCursor(formattedState.selection)
		const adjacentIndex = Adjacent.getWordBreakIndex(formattedState.value, cursorPosition, direction)
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
	private replace(state: tidily.State, insertString: string): void {
		state.value =
			state.value.substring(0, state.selection.start) + insertString + state.value.substring(state.selection.end)
		state.selection.start = state.selection.start + insertString.length
		state.selection.end = state.selection.start
	}

	private unformatState(formattedState: tidily.State): tidily.State {
		return tidily.State.copy(this.formatter.unformat(tidily.StateEditor.copy(formattedState)))
	}
	private partialFormatState(unformattedState: tidily.State): Readonly<tidily.State> & tidily.Settings {
		return this.formatter.partialFormat(tidily.StateEditor.copy(unformattedState))
	}
	private createFormattedState(state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		return this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy(state))))
	}
	private toString(value: any): string {
		return this.formatter.toString(value)
	}
	public initialState(value: any, inputElement?: HTMLInputElement): Readonly<tidily.State> & tidily.Settings {
		const stringValue = this.toString(value) || ""
		const start = stringValue.length
		const state = this.createFormattedState({
			value: stringValue,
			selection: { start, end: start, direction: "none" },
		})
		if (inputElement)
			inputElement.value = state.value
		return state
	}
	public setValue(
		inputElement: HTMLInputElement,
		formattedState: Readonly<tidily.State> & tidily.Settings,
		value: any
	): Readonly<tidily.State> & tidily.Settings {
		const result = {
			...formattedState,
			value: this.createFormattedState({ value: this.formatter.toString(value), selection: formattedState.selection })
				.value,
		}
		inputElement.value = result.value
		return result
	}
	public getValue(formattedState: tidily.State): any {
		return this.formatter.fromString(this.unformatState(formattedState).value)
	}
	public setSelection(
		inputElement: HTMLInputElement,
		formattedState: Readonly<tidily.State> & tidily.Settings,
		start: number,
		end: number
	) {
		inputElement.focus()
		inputElement.selectionStart = start
		inputElement.selectionEnd = end
		this.select(formattedState, start, end)
		return formattedState
	}
}
