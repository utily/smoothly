import { isly } from "isly"

export interface Item extends Item.Element {}

export namespace Item {
	export interface Element {
		value: any
		selected?: boolean
		deselectable: boolean
		filter: (filter: string) => Promise<void>
	}
	export namespace Element {
		export const type = isly.object<Element>({
			value: isly.any(),
			deselectable: isly.boolean(),
			selected: isly.boolean().optional(),
			filter: isly.function(),
		})
		export const is = type.is
	}
	export const type = Element.type.extend<Item>({})
	export const is = type.is
}
