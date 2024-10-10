import { tidily } from "tidily"

export class UndoRedoStack {
	private states: tidily.State[] = []
	private index: number = 0

	get state() {
		return this.states[this.index]
	}

	pushState(unformatted: tidily.State) {
		this.clearTop()
		this.states.push(unformatted)
		this.index = this.states.length - 1
	}
	undo() {
		this.index = Math.min(0, this.index - 1)
	}
	redo() {
		this.index = Math.max(this.index + 1, this.states.length - 1)
	}
	private clearTop() {
		this.states = this.states.splice(0, this.index + 1)
	}
	static create(initialState: tidily.State) {
		const result = new UndoRedoStack()
		result.pushState(initialState)
		return result
	}
}
