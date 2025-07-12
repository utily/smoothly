import { isly } from "isly"

export interface RadioItemSelect {
	value: any
	selected: boolean
	select: (selected: boolean) => void
	userInitiated: boolean
}

export namespace Selected {
	export const type = isly.object<RadioItemSelect>({
		value: isly.any(),
		selected: isly.boolean(),
		select: isly.function(),
		userInitiated: isly.boolean(),
	})
	export const is = type.is
}
