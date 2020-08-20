export interface Trigger {
	name: string
	value?: any
}
export class Trigger {
	static is(value: Trigger | any): value is Trigger {
		return typeof value == "object" && typeof value.name == "string"
	}
}
