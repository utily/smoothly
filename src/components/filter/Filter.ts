import { EventEmitter } from "@stencil/core"
import { selectively } from "selectively"
import { isly } from "isly"

const EventEmitter = isly.object<EventEmitter>({ emit: isly.function<EventEmitter["emit"]>() })
export interface Filter extends Filter.Element {
	smoothlyFilterUpdate: EventEmitter<Filter.Update>
	smoothlyFilterManipulate: EventEmitter<Filter.Manipulate>
}
export namespace Filter {
	export type Manipulate = (criteria: selectively.Criteria) => selectively.Criteria
	export type Update = (expression: selectively.Criteria) => void
	export interface Element {
		property?: string
		properties?: Record<string, string>
	}
	export namespace Element {
		export const type = isly.object<Element>({
			property: isly.string().optional(),
			properties: isly.record<Record<string, string>>(isly.string(), isly.string()).optional(),
		})
	}
	export const type = Element.type.extend<Filter>({
		smoothlyFilterUpdate: EventEmitter,
		smoothlyFilterManipulate: EventEmitter,
	})
}
