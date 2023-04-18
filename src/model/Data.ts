type Value = string | number | boolean | Blob | undefined
export type Data = { [name: string]: Data | Value }

export namespace Data {
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
		return Object.entries(data).reduce((result, [name, value]) => set(result, name.split("."), value), {})
	}
}
