import { Component, h, Host, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-table-expandable-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableExpandableRow {
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Listen("click")
	onClick() {
		this.open = !this.open
	}
	render() {
		return [
			<Host>
				<tr>
					<slot></slot>
				</tr>
				<tr>
					<td colSpan={500} class={!this.open ? "hide" : ""}>
						<slot name="detail"></slot>
					</td>
				</tr>
				,
			</Host>,
		]
	}
}
