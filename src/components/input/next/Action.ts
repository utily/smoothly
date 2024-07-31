import { isoly } from "isoly"
import { tidily } from "tidily"
import { getAdjacentWordBreakIndex } from "./adjecentWordBreak"

type Formatter = tidily.Formatter & tidily.Converter<any>

type Composition = {
	data: string
	selection: {
		start: number
		end: number
	}
}
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

	public composition?: Composition // TODO make private
	public onCompositionStart(event: CompositionEvent, state: tidily.State) {
		const result = this.unformattedState(this.updateSelectionFromElement(event.target as HTMLInputElement, state))
		// event.stopPropagation()
		this.composition = {
			data: event.data,
			selection: {
				start: result.selection.start,
				end: result.selection.start + event.data.length,
			},
		}
		console.log(event.type, event)
		return this.formatState(result)
	}
	public onCompositionUpdate(event: CompositionEvent, state: tidily.State) {
		let result = this.unformattedState(this.updateSelectionFromElement(event.target as HTMLInputElement, state))
		// event.stopPropagation()
		this.composition!.data = event.data
		result = this.substituteComposition(this.composition!, result)
		this.composition!.selection = {
			start: this.composition?.selection.start ?? 0,
			end: (this.composition?.selection.start ?? 0) + event.data.length,
		}
		console.log(event.type, event)
		return this.formatState(result)
	}
	public onCompositionEnd(event: CompositionEvent, state: tidily.State) {
		let result = this.unformattedState(this.updateSelectionFromElement(event.target as HTMLInputElement, state))
		// event.stopPropagation()
		this.composition!.data = event.data
		result = this.substituteComposition(this.composition!, result)
		this.composition!.selection = {
			start: this.composition?.selection.start ?? 0,
			end: (this.composition?.selection.start ?? 0) + event.data.length,
		}
		this.composition = undefined
		console.log(event.type, event)
		return this.formatState(result)
	}
	substituteComposition(composition: Composition, state: tidily.State) {
		state.value =
			state.value.substring(0, composition.selection.start) +
			composition.data +
			state.value.substring(composition.selection.end)
		state.selection.start = composition.selection.end
		state.selection.end = composition.selection.end
		return state
	}

	public onBeforeInput(event: InputEvent, state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		const unformatted = this.unformattedState(this.updateSelectionFromElement(event.target as HTMLInputElement, state))
		const result = this.beforeInputEventHandlers[event.inputType]?.(event, unformatted, state) ?? state
		const formatted = this.formatState(result)
		if (event.defaultPrevented) {
			;(event.target as HTMLInputElement).value = formatted.value
		}
		return formatted
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
			// TODO - exception for password
			event.preventDefault()
			return this.deleteWord(formattedState, "backward")
		},
		deleteWordForward: (event, _, formattedState) => {
			// TODO - exception for password
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
		deleteByCut: (_, state) => {
			this.erase(state)
			return state
		},
		insertCompositionText: (event, state) => {
			event.preventDefault()
			return state
		},
		// insertFromDrop - TODO
		// historyUndo - TODO
		// historyRedo - TODO
		// insertLineBreak - TODO
	}
	public onInput(event: InputEvent, state: tidily.State): Readonly<tidily.State> & tidily.Settings {
		const unformatted = this.unformattedState(this.updateSelectionFromElement(event.target as HTMLInputElement, state))
		const result = this.inputEventHandlers[event.inputType]?.(event, unformatted, state) ?? state
		const formatted = this.formatState(result)
		if (event.defaultPrevented) {
			;(event.target as HTMLInputElement).value = formatted.value
		}
		return formatted
	}
	private inputEventHandlers: {
		[inputType: string]:
			| ((event: InputEvent, unformatted: tidily.State, formatted: tidily.State) => tidily.State)
			| undefined
	} = {
		insertReplacementText: (event, state) => {
			console.log("on beforeInput insertReplacementText", (event.target as HTMLInputElement).value)
			return { ...state, value: (event.target as HTMLInputElement).value }
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

	public insertFromPaste(state: tidily.State) {}

	public unformattedState(formattedState: tidily.State) {
		return tidily.State.copy(this.formatter.unformat(tidily.StateEditor.copy(formattedState)))
	}
	public formatState(unformattedState: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(unformattedState))
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

	public createState(state: tidily.State) {
		return this.formatter.format(tidily.StateEditor.copy(this.formatter.unformat(tidily.StateEditor.copy(state))))
	}
}
