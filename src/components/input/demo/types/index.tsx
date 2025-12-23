import { Component, h, Host } from "@stencil/core"
import { tidily } from "tidily"

@Component({
	tag: "smoothly-input-demo-types",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemoTypes {
	types: tidily.Type[] = [
		"text",
		"integer",
		"price",
		"percent",
		"password",
		"email",
		"card-number",
		"card-expires",
		"card-csc",
	] as const

	render() {
		return (
			<Host>
				<h3>Input Types</h3>
				{this.types.map(type => (
					<smoothly-input name={type} type={type} key={type}>
						{type}
						<smoothly-input-clear slot="end" />
					</smoothly-input>
				))}
			</Host>
		)
	}
}
