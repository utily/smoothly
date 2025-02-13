import { Component, h, Host, Prop, State, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-display-delimited",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayDelimited {
	@Prop() value?: string
	@Prop() separator: string = ","
	@Prop() rowSeparator: string = "\n"
	@State() cells?: string[][]

	componentWillLoad() {
		this.cells = this.value?.split(this.rowSeparator).map(row => row.split(this.separator))
	}

	render(): VNode {
		return (
			<Host>
				{this.value?.split(this.rowSeparator).map(row => (
					<div>
						{row.split(this.separator).map((cell: string) => (
							<span>
								{cell}
								<span class="separator">{this.separator}</span>
							</span>
						))}
					</div>
				))}
			</Host>
		)
	}
}
