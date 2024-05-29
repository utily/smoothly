import { isly } from "isly"
import { Data } from "./Data"

export interface Submit {
	type?: typeof Submit.types[number]
	result: (result: boolean) => void
	value: Data
}
export namespace Submit {
	export const types = ["update", "change", "fetch", "create", "remove"] as const
	export const type = isly.object<Submit>({
		type: isly.string(types).optional(),
		result: isly.function(),
		value: Data.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
