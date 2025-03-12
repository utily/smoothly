import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from "@stencil/core"
import * as langly from "langly"
import { Clearable } from "../input/Clearable"
import * as translation from "./translation"
@Component({
	tag: "smoothly-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyCheckbox implements Clearable {
	@Element() element: HTMLElement
	@Prop() size: "tiny" | "small" | "medium" | "large" = "tiny"
	@Prop({ mutable: true, reflect: true }) checked = false
	@Prop({ mutable: true, reflect: true }) intermediate = false
	@Prop({ reflect: true }) unavailable = false
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) name: string
	@Prop() value: any
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@State() t: langly.Translate

	componentWillLoad() {
		this.t = translation.create(this.element)
	}

	@Watch("checked")
	@Watch("unavailable")
	unavailableChanged(): void {
		if (this.unavailable && this.checked)
			this.smoothlyInput.emit({ [this.name]: undefined })
	}

	@Method()
	async toggle(): Promise<void> {
		if (!this.disabled && !this.unavailable) {
			const checked = this.intermediate || this.checked == false
			this.smoothlyInput.emit({
				[this.name]: checked ? this.value : undefined,
			})
			this.checked = checked
		}
	}
	@Method()
	async clear() {
		this.checked = false
		this.smoothlyInput.emit({ [this.name]: undefined })
	}

	render() {
		return (
			<Host>
				<smoothly-icon
					toolTip={this.t(!this.checked ? "Select" : "De-select")}
					onClick={() => this.toggle()}
					size={this.size}
					name={
						this.unavailable
							? "close-outline"
							: this.intermediate && !this.checked
							? "remove-outline"
							: this.checked && !this.intermediate
							? "checkmark-outline"
							: "empty"
					}
				/>
				<label htmlFor={this.name}>
					<slot />
				</label>
				<div class={"expansion"}>
					<slot name="expansion" />
				</div>
			</Host>
		)
	}
}
