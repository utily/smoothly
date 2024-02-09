export interface Immutable {
	updateReadonly(status: boolean): Promise<void>
}
export namespace Immutable {
	export function is(value: Immutable | any): value is Immutable {
		return value && typeof value == "object" && typeof value.updateReadonly == "function"
	}
}
