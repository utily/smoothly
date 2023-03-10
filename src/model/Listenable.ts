export class Listenable<T extends Record<string, any>> {
	#listeners: Listeners<ListenableProperties<T>> = {}
	listen<K extends keyof ListenableProperties<T>>(
		this: T & Listenable<T>,
		property: K,
		listener: Listener<T[K]>
	): void {
		this.#listeners[property]?.push(listener) ?? (this.#listeners[property] = [listener])
		listener(this[property])
	}
	unlisten<K extends keyof ListenableProperties<T>>(property: K, listener: Listener<T[K]>): void {
		const index = this.#listeners[property]?.indexOf(listener)
		index != undefined && index >= 0 && this.#listeners[property]?.splice(index, 1)
	}

	static load<T extends Record<string, any>>(backend: T, listenable?: Listenable<T>): T & Listenable<T> {
		const result = listenable ?? new Listenable()

		return Object.defineProperties(result, getProperties(backend)) as T & Listenable<T>

		function getProperties(backend: any) {
			return Object.fromEntries(
				(
					Object.entries({
						...Object.getOwnPropertyDescriptors(backend),
						...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(backend)),
					}) as [keyof T, PropertyDescriptor][]
				).map(([name, descriptor]) => [
					name,
					typeof descriptor.value == "function"
						? {
								get() {
									return backend[name].bind(backend)
								},
						  }
						: descriptor.writable || descriptor.set
						? {
								get() {
									return backend[name]
								},
								set(value: any) {
									backend[name] = value
									result.#listeners[name]?.forEach(listener => listener(backend[name]))
								},
						  }
						: {
								get() {
									return backend[name].bind(backend)
								},
						  },
				])
			)
		}
	}
}
type ListenableProperties<T> = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[P in keyof T as T[P] extends Function ? never : P]: T[P]
}

export type Listener<V> = (value: V) => void
export type Listeners<T> = {
	[K in keyof T]?: Listener<T[K]>[]
}
