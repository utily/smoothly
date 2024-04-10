import { isly } from "isly"

export interface Editable extends Editable.Element {
	changed: boolean
	value: any
}
export namespace Editable {
	export interface Element {
		edit: Editable.Edit
		readonly: boolean
		listen: Editable.Listen
	}
	export namespace Element {
		export const type = isly.object<Element>({
			edit: isly.function(),
			readonly: isly.boolean(),
			listen: isly.function<Listen>(),
		})
	}
	export type Listen = (property: "changed", listener: (parent: Editable) => Promise<void>) => void
	export type Edit = (editable: boolean) => Promise<void>
	export const type = Element.type.extend<Editable>({
		changed: isly.boolean(),
		value: isly.any(),
	})
}
