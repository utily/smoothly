import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-display-demo-json",
})
export class SmoothlyDisplayDemoJson {
	render() {
		return (
			<Host>
				{[0, 1, 3, undefined].map(colapseDepth => [
					<div>collapseDepth={colapseDepth ?? "undefined"}</div>,
					<div>
						<smoothly-display type="json" value={json} collapseDepth={colapseDepth} />
					</div>,
				])}
			</Host>
		)
	}
}

const json = {
	name: "stringy",
	nested: {
		age: 109,
		array: ["one", "two", "three", { name: "four" }],
		emptyObject: {},
		emptyArray: [],
		truthy: true,
		falsy: false,
		null: null,
		notDefined: undefined,
		longString:
			"pepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakorpepparkakor",
	},
}
