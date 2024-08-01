import { FunctionalComponent, h } from "@stencil/core"
import { isly } from "isly"

export const JsonValue: FunctionalComponent<{value: any}> = ({ value }, _) => {
	return (Array.isArray(value) 
	? <smoothly-display-json-array value={value}></smoothly-display-json-array> 
	: isly.object().is(value) 
	? <smoothly-display-json-record value={value}></smoothly-display-json-record> 
	: <smoothly-display-json-primitive value={value}></smoothly-display-json-primitive>)
}
