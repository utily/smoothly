export interface Submitable {
	submit(): Promise<void>
}
export namespace Submitable {
	export function is(value: Submitable | any): value is Submitable {
		return value && typeof value == "object" && typeof value.submit == "function"
	}
}
