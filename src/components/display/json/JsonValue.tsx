import { FunctionalComponent, h } from "@stencil/core"
import { isly } from "isly"

export const JsonValue: FunctionalComponent<{ value: any; collapseDepth?: number }> = ({ value, collapseDepth }) => {
	return isly.object().is(value) || Array.isArray(value) ? (
		<smoothly-display-json-object value={value} collapseDepth={collapseDepth} />
	) : (
		<smoothly-display-json-primitive value={value} />
	)
}
