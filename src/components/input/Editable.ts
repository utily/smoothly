import { isly } from "isly"

export interface Editable extends Editable.Element {
	changed: boolean
	value?: any
}
export namespace Editable {
	export interface Element {
		edit: Editable.Edit
		reset: Editable.Reset
		readonly: boolean
		listen: Editable.Listen
		setInitialValue: () => void
	}
	export namespace Element {
		export const type = isly.object<Element>({
			edit: isly.function(),
			readonly: isly.boolean(),
			listen: isly.function<Listen>(),
			reset: isly.function<Reset>(),
			setInitialValue: isly.function(),
		})
	}
	export type Listen = (property: "changed", listener: (parent: Editable) => Promise<void>) => void
	export type Edit = (editable: boolean) => Promise<void>
	export type Reset = () => Promise<void>
	export const type = Element.type.extend<Editable>({
		changed: isly.boolean(),
		value: isly.any().optional(),
	})
}
