export interface Action {
	name: string
	value?: any
}

// tslint:disable-next-line:no-namespace
export namespace Action {
	export function is(value: Action | any): value is Action {
		return typeof(value) == "object" &&
			typeof(value.name) == "string"
	}
}
