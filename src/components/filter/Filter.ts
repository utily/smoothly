import { EventEmitter } from "@stencil/core"
import { selectively } from "selectively"
import { isly } from "isly"

const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
export interface Filter extends Filter.Element {
	filterRegister: EventEmitter<Filter.Update>
	filter: EventEmitter<Filter.Function>
}
export namespace Filter {
	export type Function = (criteria: Record<string, selectively.Criteria>) => Record<string, selectively.Criteria>
	export type Update = (expression: selectively.Criteria) => void
	export interface Element {
		property: string
	}
	export namespace Element {
		export const type = isly.object<Element>({
			property: isly.string(),
		})
	}
	export const type = Element.type.extend<Filter>({
		filterRegister: EventEmitter,
		filter: EventEmitter,
	})
}
