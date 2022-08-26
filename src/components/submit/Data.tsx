export type Data = string | { [name: string]: Data }
export namespace Data {
	export function set(data: Record<string, Data>, [head, ...tail]: string[], value: string): Record<string, Data> {
		const current = data[head]
		return { ...data, [head]: tail.length < 1 ? value : set(typeof current == "object" ? current : {}, tail, value) }
	}
	export function deepen(input: Record<string, string>) {
		return Object.entries(input).reduce((r, [property, value]) => set(r, property.split("."), value), {})
	}
}
