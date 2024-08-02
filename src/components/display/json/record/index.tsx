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

	componentWillLoad() {
		if (Array.isArray(this.value)) {
			this.openBracket = "["
			this.closeBracket = "]"
			this.empty = this.value.length == 0
		} else {
			this.openBracket = "{"
			this.closeBracket = "}"
			this.empty = Object.keys(this.value).length == 0
		}
	}

	render(): VNode {
		return (
			<Host class={{ empty: this.empty }}>
				<span class="open-bracket" onClick={() => (this.open = !this.open)}>
					{this.openBracket}
				</span>
				<span class="content">
					{Array.isArray(this.value)
						? this.value.map(v => (
								<div class="indent">
									<JsonValue value={v}></JsonValue>,
								</div>
						  ))
						: Object.entries(this.value).map(([k, v]) => (
								<div class="indent">
									{<smoothly-display-json-record-key value={k}></smoothly-display-json-record-key>}:{" "}
									{<JsonValue value={v}></JsonValue>},
								</div>
						  ))}
				</span>
				<span>{this.closeBracket}</span>
			</Host>
		)
	}
}
