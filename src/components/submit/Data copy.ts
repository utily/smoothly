export type Data = { [name: string]: Data | string }

export namespace Data {
	export function set(data: Data, [head, ...tail]: string[], value: string): Data {
		const current = data[head]
		return { ...data, [head]: !tail.length ? value : set(typeof current == "object" ? current : {}, tail, value) }
	}
	export function deepen(data: Record<string, string>): Data {
		return Object.entries(data).reduce((result, [name, value]) => set(result, name.split("."), value), {})
	}
}
