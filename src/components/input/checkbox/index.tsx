import { Component, ComponentWillLoad, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core"
import { Color, Data } from "../../../model"
import { Clearable } from "../Clearable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputCheckbox implements Input, Clearable, ComponentWillLoad {
	@Prop() name: string
	@Prop() value: Data[string] = undefined
	@Prop({ mutable: true }) checked = false
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true }) disabled: boolean
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInput.emit({ [this.name]: this.checked ? this.value : undefined })
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	@Method()
	async clear(): Promise<void> {
		!this.disabled && (this.checked = false)
	}
	@Watch("checked")
	elementCheck(): void {
		this.smoothlyInput.emit({ [this.name]: this.checked ? this.value : undefined })
	}
	inputHandler(event: MouseEvent) {
		!this.disabled && event.target instanceof HTMLInputElement && (this.checked = event.target.checked)
	}
	render() {
		return (
			<Host>
				{this.checked && <smoothly-icon name="checkmark-outline" size="tiny" />}
				<input type="checkbox" checked={this.checked} onClick={event => this.inputHandler(event)} />
				<label>
					<slot />
				</label>
			</Host>
		)
	}
}
