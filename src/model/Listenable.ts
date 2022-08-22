export class Listenable<T extends Record<string, any>> {
	#listeners: Listeners<T> = {}
	listen<K extends keyof T>(this: T & Listenable<T>, event: K, listener: Listener<T[K]>): void {
		this.#listeners[event]?.push(listener) ?? (this.#listeners[event] = [listener])
		listener(this[event])
	}
	static load<T>(backend: T): T & Listenable<T> {
		const result = new Listenable()
		for (const property in backend) {
			if (Object.prototype.hasOwnProperty.call(backend, property)) {
				Object.defineProperty(result, property, {
					get() {
						return backend[property]
					},
					set(v) {
						backend[property] = v
						result.#listeners[property]?.forEach(l => l(v))
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
