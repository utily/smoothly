import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { ChildListener } from "./ChildListener"

export interface Editable extends Editable.Element {
	changed: boolean
	value?: any
	childListener?: ChildListener
	smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
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
		export const is = type.is
	}
	export type Listen = (property: "changed", listener: (parent: Editable) => Promise<void>) => void
	export type Edit = (editable: boolean) => Promise<void>
	export type Reset = () => Promise<void>
	const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
	export const type = Element.type.extend<Editable>({
		changed: isly.boolean(),
		value: isly.any().optional(),
		childListener: isly.fromIs("ChildListener", (v): v is ChildListener => v instanceof ChildListener).optional(),
		smoothlyFormDisable: EventEmitter,
	})
	export const is = type.is
}
