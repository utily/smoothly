import { isly } from "isly"

type Value = string | number | boolean | Blob | undefined
export type Data = { [name: string]: Data | Data[] | Value | Value[] }
export namespace Data {
	export const valueType = isly.union<Value, string, number, boolean, Blob, undefined>(
		isly.string(),
		isly.number(),
		isly.boolean(),
		isly.fromIs("Blob", value => value instanceof Blob),
		isly.undefined()
	)
	export const type: isly.Type<Data> = isly.record<Data>(
		isly.string(),
		isly.union(
			isly.lazy(() => type, "Data"),
			valueType
		)
	)

	export function set(data: Data, [head, ...tail]: string[], value: Value): Data {
		const current = data[head ?? ""]
		return {
			...data,
			[head ?? ""]: !tail.length
				? value
				: set(
						typeof current == "object" && !Array.isArray(current) && !(current instanceof Blob) ? current : {},
						tail,
						value
				  ),
		}
	}
	export function deepen(data: Record<string, Value>): Data {
		return merge({}, data)
	}
	function isArrayRecord(d: any): d is Record<`${number}`, any> {
		return (
			isly.object().is(d) && (keys => !!keys.length && keys.every(k => parseInt(k).toString() == k))(Object.keys(d))
		)
	}
	export function convertArrays(data: any): Data {
		return isArrayRecord(data)
			? Object.entries(data).reduce((arr: Data[], [k, v]: [`${number}`, any]) => {
					arr[k] = convertArrays(v)
					return arr
			  }, [])
			: isly.object().is(data) && !(data instanceof Blob || data instanceof File)
			? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, convertArrays(v)]))
			: data
	}
	export function merge(data: Data, changes: Record<string, any>): Data {
		return Object.entries(changes).reduce((r, [name, value]) => set(r, name.split("."), value), data)
	}
	export function remove(data: Data, name: string): any {
		const keys = name.split(".")
		removeKey(data, keys)
		return data
	}
	function removeKey(current: any, [head, ...tail]: string[]) {
		if (tail.length === 0) {
			if (typeof current === "object" && head in current)
				delete current[head]
		} else if (typeof current === "object" && head in current) {
			removeKey(current[head], tail)
			if (isEmpty(current[head]))
				delete current[head]
		}
	}
	function isEmpty(current: any): boolean {
		return typeof current === "object" && Object.keys(current).length === 0
	}
}
