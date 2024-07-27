import { isoly } from "isoly"
import { tidily } from "tidily"

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
	public insertText(state: tidily.State, insertString: string) {
		const result = this.unformattedState(state)
		if (this.formatter.allowed(insertString, result)) {
			this.replace(result, insertString)
		}
		return this.formatter.format(tidily.StateEditor.copy(result))
	}
	public deleteContentBackward(state: tidily.State) {
		const result = this.unformattedState(state)
		if (result.selection.start == result.selection.end)
			this.select(result, result.selection.start - 1, result.selection.end)
		this.erase(result)
		return this.formatState(result)
	}
	public deleteContentForward(state: tidily.State) {}
	public deleteWordBackward(state: tidily.State) {}
	public deleteWordForward(state: tidily.State) {}
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
