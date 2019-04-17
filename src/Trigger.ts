export interface Trigger {
	name: string
	value?: any
}
// tslint:disable-next-line:no-namespace
export namespace Trigger {
	export function is(value: Trigger | any): value is Trigger {
		return typeof(value) == "object" &&
			typeof(value.name) == "string"
	}
}
