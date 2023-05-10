export interface Editable {
	readonly?: boolean
	setReadonly(readonly: boolean): Promise<void>
}
export namespace Editable {
	export function is(value: Editable | any): value is Editable {
		return value && typeof value == "object" && typeof value.setReadonly == "function"
	}
}
