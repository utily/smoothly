const observers = new WeakMap<HTMLElement, IntersectionObserver>()
export namespace Observers {
	export function get(...parameters: Parameters<typeof observers.get>): ReturnType<typeof observers.get> {
		return observers.get(...parameters)
	}
	export function set(...parameters: Parameters<typeof observers.set>): IntersectionObserver {
		observers.set(...parameters)
		return parameters[1]
	}
	export function remove(...parameters: Parameters<typeof observers.delete>): ReturnType<typeof observers.delete> {
		return observers.delete(...parameters)
	}
	export function has(...parameters: Parameters<typeof observers.has>): ReturnType<typeof observers.has> {
		return observers.has(...parameters)
	}
}
