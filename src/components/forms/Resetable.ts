export interface Resetable {
	reset(values: { [key: string]: any }): Promise<void>
	getValues(): Promise<{ [key: string]: any }>
}
export namespace Resetable {
	export function is(value: Resetable | any): value is Resetable {
		return value && typeof value == "object" && typeof value.reset == "function"
	}
}
