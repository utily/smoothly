export class Listenable<T extends Record<string, any>> {
	#listeners = {} as Record<keyof T, Listener<T>[] | undefined>
	listen<E extends keyof T>(event: E, listener: Listener<T>): void {
		this.#listeners[event]?.push(listener) ?? (this.#listeners[event] = [listener])
		listener((this as T)[event])
	}
	static load<T>(backend: T): T & Listenable<T> {
		const result = new Listenable() as T & Listenable<T>
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
		return result
	}
}

export type Listener<T> = (value: T) => void
