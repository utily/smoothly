import { Component, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core"
import { Color } from "../../../model"
import { Looks } from "../Looks"
// import { Component, ComponentWillLoad } from "@stencil/core";
// import { Input } from "../Input";
// import { Clearable } from "../Clearable";

@Component({
	tag: "smoothly-input-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputCheckbox {
	@Prop({ mutable: true }) value: any = undefined
	@Prop({ mutable: true }) checked = false
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ mutable: true }) name: string
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyCheckboxRegister: EventEmitter<(name: string) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyCheckboxRegister.emit(name => (this.name = name))
		//this.checked && this.inputHandler()
	}

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("checked")
	elementCheck(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	inputHandler(event: MouseEvent) {
		event.target instanceof HTMLInputElement &&
			((this.checked = !this.checked), !this.checked && (this.value = undefined))
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
