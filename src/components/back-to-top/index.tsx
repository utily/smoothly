import { Component, Element, h, Host, Prop, State } from "@stencil/core"
import { Scrollable } from "../../model/Scrollable"

@Component({
	tag: "smoothly-back-to-top",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyBackToTop {
	private scrollableParent?: HTMLElement
	@Element() element: HTMLSmoothlyBackToTopElement
	@Prop() opacity = "0.5"
	@Prop() bottom = "1rem"
	@Prop() right = "1rem"
	@State() visible: boolean
	componentWillLoad() {
		this.scrollableParent = Scrollable.findParent(this.element)
		this.scrollableParent?.addEventListener("scroll", () => {
			this.visible = (this.scrollableParent?.scrollTop ?? 0) > 20
		})
	}
	render() {
		const cssVariables = {
			"--opacity": this.visible ? this.opacity : "0",
			"--pointer-events": this.visible ? "auto" : "none",
			"--bottom": this.bottom,
			"--right": this.right,
		}
		return (
			<Host
				style={cssVariables}
				onClick={() =>
					this.scrollableParent?.scrollTo({
						top: 0,
						left: 0,
						behavior: "smooth",
					})
				}>
				<smoothly-icon name="caret-up-outline"></smoothly-icon>
			</Host>
		)
	}
}
