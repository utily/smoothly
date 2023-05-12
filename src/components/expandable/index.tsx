import { Component, h, Host, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-expandable",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyExpandable {
	detail?: HTMLElement
	@Prop({ mutable: true, reflect: true }) open = false

	@Listen("smoothlyExpand")
	filterHandler(event: CustomEvent<HTMLElement | undefined>) {
		event.stopPropagation()
		if ((this.open = event.detail != undefined) && this.detail) {
			this.detail.innerHTML = ""
			this.detail.append(event.detail)
		}
	}
	render() {
		return (
			<Host>
				<slot></slot>
				<section ref={detail => (this.detail = detail)}></section>
			</Host>
		)
	}
}
