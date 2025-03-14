import { Component, h, Host, Prop, State, VNode, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-table-row-lazy",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableRowLazy {
	@Prop() data: any[]
	@Prop() row: (entry: any) => VNode | VNode[]
	@State() length: number = 50

	@Watch("length")
	lengthWatcher() {
		console.log("length", this.length)
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				{this.data.slice(0, this.length).map(this.row)}
				<smoothly-load-more onSmoothlyLoadMore={e => (this.length += 50)} multiple />
			</Host>
		)
	}
}
