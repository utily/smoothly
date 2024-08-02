import { Component, ComponentWillLoad, h, Host, Prop, State, VNode } from "@stencil/core"
import { JsonValue } from "../JsonValue"

@Component({
	tag: "smoothly-display-json-object",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDisplayJsonObject implements ComponentWillLoad {
	@Prop() value: Record<string, any> | any[]
	@Prop({ reflect: true, mutable: true }) open = true
	@State() empty: boolean
	private openBracket: string = ""
	private closeBracket: string = ""
	private length: number

	componentWillLoad() {
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
		return (
			<Host class={{ empty: this.empty }}>
				<span class="open-bracket" onClick={() => (this.open = !this.open)}>
					{this.openBracket}
				</span>
				<span class="content">
					{Array.isArray(this.value)
						? this.value.map((v, index) => (
								<div class="indent">
									<JsonValue value={v}></JsonValue>
									{index < this.length - 1 ? "," : ""}
								</div>
						  ))
						: Object.entries(this.value).map(([k, v], index) => (
								<div class="indent">
									{<smoothly-display-json-record-key value={k}></smoothly-display-json-record-key>}:{" "}
									{<JsonValue value={v}></JsonValue>}
									{index < this.length - 1 ? "," : ""}
								</div>
						  ))}
				</span>
				<span>{this.closeBracket}</span>
			</Host>
		)
	}
}
