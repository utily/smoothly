import { Editable } from "."

export type Listener = (parent: Editable) => Promise<void>

export class Observer {
	private callbacks: Listener[] = []
	constructor(private parent: Editable) {}

	async subscribe(callback: Listener) {
		this.callbacks.push(callback)
		await callback(this.parent)
	}

	async publish() {
		Promise.all(this.callbacks.map(callback => callback(this.parent)))
	}

	static create(parent: Editable) {
		return new Observer(parent)
	}
}
