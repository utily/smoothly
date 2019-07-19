import { State } from "./State"

export class StateEditor implements State {
	get value(): string { return this.state.value }
	set value(value: string) { this.state.value = value }
	get selectionStart(): number { return this.state.selectionStart }
	set selectionStart(selectionStart: number) { this.state.selectionStart = selectionStart }
	get selectionEnd(): number { return this.state.selectionEnd }
	set selectionEnd(selectionEnd: number) { this.state.selectionEnd = selectionEnd }

	private constructor(private state: State) { }

	get(index: number): string {
		return this.value[index]
	}
	isDigit(index: number): boolean {
		const character = this.get(index)
		return character >= "0" && character <= "9"
	}

	match(matcher: { [Symbol.match](string: string): RegExpMatchArray | null }): RegExpMatchArray | null {
		return this.value.match(matcher)
	}
	replace(value: string, start: number, end: number): StateEditor {
		this.value = this.value.slice(0, start) + value + this.value.slice(end, this.value.length)
		if (this.selectionStart >= end)
			this.selectionStart = this.selectionStart + value.length - end + start
		else if (this.selectionStart > start && this.selectionStart < end)
			this.selectionStart = Math.min(this.selectionStart, start + value.length)
		if (this.selectionEnd >= end)
			this.selectionEnd = this.selectionEnd + value.length - end + start
		else if (this.selectionEnd > start && this.selectionEnd < end)
			this.selectionEnd = Math.min(this.selectionEnd, start + value.length)
		return this
	}
	insert(value: string, index: number): StateEditor {
		return this.replace(value, index, index)
	}
	delete(start: number, end?: number): StateEditor {
		return this.replace("", start, end || start + 1)
	}
	static copy(state: Readonly<State>): StateEditor {
		return new StateEditor({ ...state })
	}
	static create(): StateEditor {
		return new StateEditor({ value: "", selectionStart: 0, selectionEnd: 0 })
	}
	static modify(state: State): StateEditor {
		return new StateEditor(state)
	}
}