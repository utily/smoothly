import { Component, h, Host, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-0-backtotop",
	styleUrl: "style.scss",
	scoped: true,
})
export class Smoothly0Backtotop {
	@Prop() opacity = "0.5"
	@Prop() bottom = "1rem"
	@Prop() right = "1rem"
	@State() visible: boolean
	componentWillLoad() {
		window.addEventListener("scroll", () => {
			this.visible = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
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
					window.scrollTo({
						top: 0,
						left: 0,
						behavior: "smooth",
					})
				}>
				<smoothly-0-icon name="chevron-up-outline"></smoothly-0-icon>
			</Host>
		)
	}
}
