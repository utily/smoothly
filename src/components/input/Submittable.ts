export interface Submittable {
	submit(remove?: boolean): Promise<void>
}
export namespace Submittable {
	export function is(value: Submittable | any): value is Submittable {
		return value && typeof value == "object" && typeof value.submit == "function"
	}
}
