import { Listenable } from "./Listenable"

export class State {
	#id?: number
	get id(): number | undefined {
		return this.#id
	}
	set id(value) {
		this.#id = value
		this.all = undefined
	}
	#all?: readonly number[]
	get all(): readonly number[] | undefined {
		return this.#all ?? (this.#all = load(this.id ?? 0))
	}
	set all(value: readonly number[] | undefined) {
		this.#all = value
		this.current = value?.[0]
	}
	current?: number
}

const state = Listenable.load(new State())

state.listen("current", current => console.log(current))

function load(id: number): number[] {
	return [id, id + 1]
}
