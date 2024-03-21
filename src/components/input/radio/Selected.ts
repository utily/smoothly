import { isly } from "isly"

export interface Selectable {
	value: any
	selected: boolean
	select: (selected: boolean) => void
}

export namespace Selected {
	export const type = isly.object<Selectable>({
		value: isly.any(),
		selected: isly.boolean(),
		select: isly.function(),
	})
	export const is = type.is
}
