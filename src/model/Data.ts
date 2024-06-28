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
	export function convertArrays(data: any): Data {
		return typeof data == "object" &&
			data &&
			Object.keys(data)
				.sort()
				.every((k, i) => `${k}` == `${i}`)
			? (Object.entries(data)
					.sort(([k0, _], [k1, _1]) => (k0 > k1 ? 1 : -1))
					.map(([_, v]) =>
						typeof v == "object" && v ? convertArrays(v as Record<string, Data>) : v
					) as unknown as Data)
			: typeof data == "object" && data
			? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, convertArrays(v)]))
			: data
	}
	export function merge(data: Data, changes: Record<string, any>): Data {
		return convertArrays(Object.entries(changes).reduce((r, [name, value]) => set(r, name.split("."), value), data))
	}
}
