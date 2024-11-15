import { Component, ComponentWillLoad, h, Host, Prop, State, VNode } from "@stencil/core"
import { JsonValue } from "../JsonValue"

@Component({
	tag: "smoothly-display-json-object",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJsonObject implements ComponentWillLoad {
	@Prop() value: Record<string, any> | any[]
	@Prop() collapseDepth?: number
	@State() open: boolean
	@State() empty: boolean
	private openBracket: string = ""
	private closeBracket: string = ""
	private length: number

	componentWillLoad() {
		this.open = typeof this.collapseDepth == "number" ? this.collapseDepth > 0 : true
		if (Array.isArray(this.value)) {
			this.openBracket = "["
			this.closeBracket = "]"
			this.length = this.value.length
		} else {
			this.openBracket = "{"
			this.closeBracket = "}"
			this.length = Object.keys(this.value).length
		}
		this.empty = this.length == 0
	}

	render(): VNode {
		const nextCollapseDepth = typeof this.collapseDepth == "number" ? Math.max(this.collapseDepth - 1, 0) : undefined
		return (
			<Host class={{ empty: this.empty, open: this.open }}>
				<span class="open-bracket" onClick={() => (this.open = !this.open)} data-length={this.length}>
					{this.openBracket}
				</span>
				<span class="content">
					{Array.isArray(this.value)
						? this.value.map(v => (
								<div class="indent">
									<JsonValue value={v} collapseDepth={nextCollapseDepth}></JsonValue>
									<span class="comma">,</span>
								</div>
						  ))
						: Object.entries(this.value).map(([k, v]) => (
								<div class="indent">
									{<smoothly-display-json-record-key value={k}></smoothly-display-json-record-key>}:{" "}
									{<JsonValue value={v} collapseDepth={nextCollapseDepth}></JsonValue>}
									<span class="comma">,</span>
								</div>
						  ))}
				</span>
				<span>{this.closeBracket}</span>
			</Host>
		)
	}
}
