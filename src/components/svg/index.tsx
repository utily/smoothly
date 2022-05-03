import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-svg",
	styleUrl: "style.css",
})
export class SmoothlySvg {
	render() {
		return (
			<object height="50em" width="50em" type="image/svg+xml" data="http://localhost:8008/intergiro/intergiro.svg" />
		)
	}
}
