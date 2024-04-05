export interface Changeable {
	changed: boolean
	listenChanged(property: "changed", listener: (parent: Changeable) => Promise<void>): void
}
export namespace Changeable {
	export function is(value: Changeable | any): value is Changeable {
		return (
			value && typeof value == "object" && typeof value.changed == "boolean" && typeof value.listenChanged == "function"
		)
	}
}
