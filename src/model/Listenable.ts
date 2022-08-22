export class Listenable<T extends Record<string, any>> {
	#listeners: Listeners<T> = {}
	listen<K extends keyof T>(this: T & Listenable<T>, property: K, listener: Listener<T[K]>): void {
		this.#listeners[property]?.push(listener) ?? (this.#listeners[property] = [listener])
		listener(this[property])
	}
	removeListener<K extends keyof T>(this: T & Listenable<T>, property: K, listener: Listener<T[K]>): void {
		const index = this.#listeners[property]?.indexOf(listener)
		index != undefined && index >= 0 && this.#listeners[property]?.splice(index, 1)
	}

	static load<T>(backend: T): T & Listenable<T> {
		const result = new Listenable()
		for (const property in backend) {
			if (Object.prototype.hasOwnProperty.call(backend, property)) {
				Object.defineProperty(result, property, {
					get() {
						return backend[property]
					},
					set(value) {
						backend[property] = value
						result.#listeners[property]?.forEach(listener => listener(value))
					},
				})
			}
		}
		return result as T & Listenable<T>
	}
}

export type Listener<V> = (value: V) => void
export type Listeners<T> = {
	[K in keyof T]?: Listener<T[K]>[]
}
