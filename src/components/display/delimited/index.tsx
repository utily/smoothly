import { Component, h, Host, Prop, State, VNode, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-display-delimited",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayDelimited {
	@Prop() value?: string
	@Prop() separator: string = ","
	@Prop() rowSeparator: string = "\n"
	@State() table?: string[][]
	@State() columns?: number

	@Watch("value")
	componentWillLoad() {
		this.table = this.value?.split(this.rowSeparator).map(row => row.split(this.separator))
		this.columns = this.table?.[0].length
	}

	render(): VNode {
		return (
			<Host style={{ "--columns": this.columns ? `${this.columns}` : undefined }}>
				{this.table?.map(row => (
					<div>
						{row.map((cell: string) => (
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
