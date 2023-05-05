import { Component, Element, h, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-offcanvas",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyOffcanvas {
	@Prop({ reflect: true }) open = false
	@Prop({ reflect: true }) position: "left" | "right" | "top" | "bottom" = "left"
	@Prop() clickable = true
	@Element() el: HTMLSmoothlyOffcanvasElement

	@Watch("open")
	onChangeOpen() {
		if (!this.open)
			return setTimeout(() => {
				this.el.style.display = "none"
			}, 600)
		this.el.style.display = "block"
	}

	connectedCallback() {
		if (!this.open)
			return (this.el.style.display = "none")
		this.el.style.display = "block"
	}

	@Listen("click")
	handleClick(e: Event) {
		if (e.target === this.el && this.clickable)
			this.open = !this.open
	}

	render() {
		return (
			<div>
				<slot></slot>
			</div>
		)
	}
}
