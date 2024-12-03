export namespace Deep {
	export function equal(a: any, b: any): boolean {
		if (a === b)
			return true
		if (typeof a == "object" && typeof b == "object") {
			const keys = Object.keys(a)
			if (keys.length == Object.keys(b).length && keys.every(key => equal(a[key], b[key])))
				return true
		}
		return false
	}
	export function notEqual(a: any, b: any): boolean {
		return !equal(a, b)
	}
}
