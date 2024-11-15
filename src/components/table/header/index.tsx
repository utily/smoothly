import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-table-header",
	styleUrl: "style.css",
	scoped: true,
})
export class TableHeader {
	@Prop({ reflect: true }) name: string
	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
