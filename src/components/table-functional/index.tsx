import { Component, h, Host, Prop } from "@stencil/core"

@Component({ tag: "smoothly-table-functional", styleUrl: "style.css", scoped: true })
export class SmoothlyTableFunctional {
	@Prop() columns = 1

	render() {
		return (
			<Host style={{ "--columns": this.columns.toString() }}>
				<slot />
			</Host>
		)
	}
}
