import { FunctionalComponent, h } from "@stencil/core"
import { isly } from "isly"

export const JsonValue: FunctionalComponent<{value: any}> = ({ value }) => {
	return (isly.object().is(value) || Array.isArray(value)
	? <smoothly-display-json-object value={value}></smoothly-display-json-object> 
	: <smoothly-display-json-primitive value={value}></smoothly-display-json-primitive>)
}
