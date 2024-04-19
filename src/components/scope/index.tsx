import { Component, h, Prop } from "@stencil/core"
import { Scope } from "../../model"

@Component({
	tag: "smoothly-scope",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyScope {
	@Prop({ reflect: true }) scope?: Scope

	render() {
		return <slot></slot>
	}
}
