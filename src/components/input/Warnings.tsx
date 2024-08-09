import { isly } from "isly"

type Value = string | boolean | undefined
export type Warnings = { [key: string]: Warnings }
export namespace Warnings {
	export type Warning = Value | Warnings
	export const valueType = isly.union<Value, string, boolean, undefined>(
		isly.string(),
		isly.boolean(),
		isly.undefined()
	)
	export const type: isly.Type<Warnings> = isly.record<Warnings>(
		isly.string(),
		isly.union(
			isly.lazy(() => type, "Warnings"),
			valueType
		)
	)
	export function get(warnings: Warnings, name: string): Warnings[string] {
		return getHelper(warnings, name.split("."))
	}
	function getHelper(warnings: Warnings, [head, ...tail]: string[]): Warnings[string] {
		const current = warnings[head ?? ""]
		return !tail.length || typeof current != "object" ? current : getHelper(current, tail)
	}
}
