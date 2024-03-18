import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, VNode } from "@stencil/core"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-color",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputColor implements Input, Clearable {
	@Element() element: HTMLElement
	@Prop({ mutable: true, reflect: true }) value: string | undefined
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop() name: string
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--value": this.value }}>
				<smoothly-input
					value={this.value}
					name={this.name}
					looks={this.looks}
					onSmoothlyInput={e => (this.value = e.detail[this.name])}>
					Color
					<div slot="end" class="color-sample"></div>
				</smoothly-input>
			</Host>
		)
	}
}
