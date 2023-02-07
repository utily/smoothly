export interface Clearable {
	clear(): Promise<void>
}
export namespace Clearable {
	export function is(value: Clearable | any): value is Clearable {
		return value && typeof value == "object" && typeof value.clear == "function"
	}
}
