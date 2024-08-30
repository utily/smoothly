import { FunctionalComponent, h } from "@stencil/core"
import { isly } from "isly"

export const JsonValue: FunctionalComponent<{ value: any; collapsed?: boolean }> = ({ value, collapsed }) => {
	return isly.object().is(value) || Array.isArray(value) ? (
		<smoothly-display-json-object value={value} collapsed={collapsed}></smoothly-display-json-object>
	) : (
		<smoothly-display-json-primitive value={value}></smoothly-display-json-primitive>
	)
}
