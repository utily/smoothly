export interface Trigger {
	name: string
	value?: any
}
export namespace Trigger {
	export function is(value: Trigger | any): value is Trigger {
		return typeof value == "object" && typeof value.name == "string"
	}
}
