import { Editable } from "./Editable"

export type Callback = (parent: Editable) => Promise<void>

export class ChildListener {
	constructor(private parent: Editable) {}

	private callbacks: Callback[] = []

	async subscribe(callback: Callback) {
		this.callbacks.push(callback)
		await callback(this.parent)
	}

	async publish() {
		Promise.all(this.callbacks.map(callback => callback(this.parent)))
	}

	static create(parent: Editable) {
		return new ChildListener(parent)
	}
}
