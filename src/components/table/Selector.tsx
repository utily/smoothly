import { h } from "@stencil/core"

export class Selector<T> {
	#selected?: T[]
	get selected(): T[] {
		return (this.#selected ??= Object.values(this.data))
	}
	private constructor(private readonly key: keyof T, private data: Readonly<Record<string, T>> = {}) {}
	handle(data: Record<string, T>): Selector<T> {
		console.log(Selector)
		return new Selector(
			this.key,
			"check-all" in data
				? data["check-all"] ?? {}
				: Object.fromEntries(Object.entries({ ...this.data, ...data }).filter(([_, value]) => value != undefined))
		)
	}
	render(item: T | T[]): any {
		return Array.isArray(item) ? (
			<smoothly-checkbox
				name="check-all"
				value={Object.fromEntries(item.map(i => [i[this.key], i]))}
				checked={this.selected.length == item.length ? true : this.selected.length == 0 ? false : "intermediate"}
			/>
		) : (
			(console.log("render", item[this.key], !!this.data[item[this.key]?.toString() ?? ""]),
			(
				<smoothly-checkbox
					name={item[this.key]?.toString()}
					value={item}
					checked={!!this.data[item[this.key]?.toString() ?? ""]}
				/>
			))
		)
	}
	static create<T>(key: keyof T): Selector<T> {
		return new Selector(key)
	}
}
