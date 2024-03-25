import { Component, Event, EventEmitter, h, Host, Method, Prop, Watch, Listen } from "@stencil/core"
import { Color } from "../../../model"
import { Looks } from "../Looks"
// import { Component, ComponentWillLoad } from "@stencil/core";
// import { Input } from "../Input";
// import { Clearable } from "../Clearable";

@Component({
	tag: "smoothly-input-checkbox-group",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputCheckboxGroup {
	@Prop({ mutable: true }) value: any = undefined
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop() name: string
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	@Listen('smoothlyInput') 
	
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	valueChange(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	render() {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
