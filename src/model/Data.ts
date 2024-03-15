import { isly } from "isly"

type Value = string | number | boolean | Blob | undefined
export type Data = { [name: string]: Data | Value }

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
				: set(typeof current == "object" && !(current instanceof Blob) ? current : {}, tail, value),
		}
	}
	export function deepen(data: Record<string, Value>): Data {
		return merge({}, data)
	}
	export function merge(data: Data, changes: Record<string, any>): Data {
		return Object.entries(changes).reduce((r, [name, value]) => set(r, name.split("."), value), data)
	}
}
