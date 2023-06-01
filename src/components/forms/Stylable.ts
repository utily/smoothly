import { Layout, Placement } from "./Input"

export interface Stylable {
	placement: Placement
	layout?: Layout
	setStyle(layout: Layout, placement: Placement): Promise<void>
}
export namespace Stylable {
	export function is(value: Stylable | any): value is Stylable {
		return value && typeof value == "object" && typeof value.setStyle == "function"
	}
}
