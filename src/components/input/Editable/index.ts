import { EventEmitter } from "@stencil/core"
import { isly } from "isly"
import { Listener as ObserverListener, Observer as EditableObserver } from "./Observer"

export interface Editable extends Editable.Element {
	isDifferentFromInitial: boolean
	value?: any
	smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
}

export namespace Editable {
	export const Observer = EditableObserver
	export namespace Observer {
		export type Listener = ObserverListener
	}
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
	export type Listen = (listener: Observer.Listener) => void
	export type Edit = (editable: boolean) => Promise<void>
	export type Reset = () => Promise<void>
	const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
	export const type = Element.type.extend<Editable>({
		isDifferentFromInitial: isly.boolean(),
		value: isly.any().optional(),
		smoothlyFormDisable: EventEmitter,
	})
	export const is = type.is
}
