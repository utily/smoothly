export type WithListenable<T extends Record<string, any>> = T & Listenable<T>

export type CanBeListenable = Record<string, any>

export interface HasListenable<T extends CanBeListenable> {
	readonly listenable: WithListenable<T>
}

export class Listenable<T extends CanBeListenable> {
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

	static load<T extends HasListenable<CanBeListenable>>(backend: T): WithListenable<T> {
		const result = backend.listenable

		return Object.defineProperties(result, getProperties(backend)) as WithListenable<T>

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
									return backend[name]
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
