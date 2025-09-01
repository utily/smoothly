import { isly } from "isly"
import { Data } from "./Data"

export interface Submit<D extends Data = Data> {
	type?: typeof Submit.values[number]
	result: (result: boolean) => void
	value: D
}
export namespace Submit {
	export const values = ["update", "change", "fetch", "create", "remove"] as const
	export const type = isly.object<Submit>({
		type: isly.string(values).optional(),
		result: isly.function(),
		value: Data.type,
	})
	export const is = type.is
	export const flaw = type.flaw
}
