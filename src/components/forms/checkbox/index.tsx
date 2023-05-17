import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from "@stencil/core"
import * as langly from "langly"
import * as translation from "./translation"
@Component({
	tag: "smoothly-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyCheckbox {
	@Element() element: HTMLElement
	@Prop() size: "tiny" | "small" | "medium" | "large" = "tiny"
	@Prop({ mutable: true, reflect: true }) checked = false
	@Prop({ mutable: true, reflect: true }) intermediate = false
	@Prop() name: string
	@Prop() value: any
	@Prop({ reflect: true }) disabled: boolean
	@Event() smoothlyChecked: EventEmitter<Record<string, any>>
	@State() t: langly.Translate

	componentWillLoad() {
		this.t = translation.create(this.element)
	}

	@Method()
	async toggle(): Promise<void> {
		if (!this.disabled) {
			const checked = this.intermediate || this.checked == false
			this.smoothlyChecked.emit({
				[this.name]: checked ? this.value : undefined,
			})
			this.checked = checked
		}
	}

	render() {
		return (
			<Host>
				<main>
					<div>
						<smoothly-icon
							toolTip={this.t(!this.checked ? "Select" : "De-select")}
							onClick={e => {
								this.toggle()
							}}
							size={this.size}
							name={
								this.intermediate && !this.checked
									? "remove-outline"
									: this.checked && !this.intermediate
									? "checkmark-outline"
									: "empty"
							}></smoothly-icon>
					</div>
					<label htmlFor={this.name}>
						<slot></slot>
					</label>
				</main>
				<slot name="expansion" />
			</Host>
		)
	}
}
