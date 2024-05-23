import { isly } from "isly"

export interface Item {
	value: any
	selected?: boolean
	filter: (filter: string) => Promise<void>
}

export namespace Item {
	export const type = isly.object<Item>({
		value: isly.any(),
		selected: isly.boolean().optional(),
		filter: isly.function(),
	})
	export const is = type.is
}
