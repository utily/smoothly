import { isly } from "isly"

type Value = string | number | boolean | Blob | undefined
export type Data = { [name: string]: Data | Value | Value[] }
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
	export function get(data: Data, name: string | string[]): Data[string] {
		return getHelper(data, typeof name == "string" ? name.split(".") : name)
	}
	function getHelper(d: Data, [head, ...tail]: string[]): Data[string] {
		const current = d[head ?? ""]
		return !tail.length
			? current
			: getHelper(
					typeof current == "object" && !Array.isArray(current) && !(current instanceof Blob) ? current : {},
					tail
			  )
	}
	export function set(data: Data, name: string | string[], value: Value): Data {
		return setHelper(data, typeof name == "string" ? name.split(".") : name, value)
	}
	function setHelper(data: Data, [head, ...tail]: string[], value: Value): Data {
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
		return isly.object().is(d) && Object.keys(d).every(k => parseInt(k).toString() == k)
	}
	export function convertArrays(data: any): Data {
		return isArrayRecord(data)
			? Object.entries(data).reduce((r: Data[], [k, v]: [`${number}`, any]) => {
					r[k] = convertArrays(v)
					return r
			  }, [])
			: isly.object().is(data)
			? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, convertArrays(v)]))
			: data
	}
	export function merge(data: Data, changes: Record<string, any>): Data {
		return Object.entries(changes).reduce((r, [name, value]) => set(r, name.split("."), value), data)
	}
	export function fromFlaw(flaw: isly.Flaw | undefined, property: Exclude<keyof isly.Flaw, "flaws"> = "message"): Data {
		return !flaw
			? {}
			: {
					[flaw.property ?? ""]: flaw.flaws
						? flaw.flaws.map(f => fromFlaw(f, property)).reduce((r, c) => ({ ...r, ...c }), {})
						: flaw[property],
			  }
	}
}
