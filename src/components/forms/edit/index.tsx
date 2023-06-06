import { Component, Event, EventEmitter, h, Listen, Prop, State } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Editable } from "../Editable"
import { Resetable } from "../Resetable"

interface Form extends Editable, Resetable {}

@Component({
	tag: "smoothly-edit",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyEdit {
	@Prop() label?: string
	@Prop() fallback?: string
	@Prop({ reflect: true }) color?: Color = "light"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "default"
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@State() readonly?: boolean
	@Event() smoothlyButtonLoad: EventEmitter<(parent: HTMLElement) => void>
	private parent: Form
	private state: { [key: string]: any }

	componentWillLoad() {
		this.smoothlyButtonLoad.emit(parent => {
			if (Editable.is(parent) && Resetable.is(parent)) {
				this.parent = parent
				this.readonly = parent.readonly
			}
		})
	}

	@Listen("click")
	async handleClick() {
		if (this.readonly)
			this.state = await this.parent.getValues()
		else
			this.parent.reset(this.state)
		this.parent.setReadonly(!this.readonly)
		this.readonly = !this.readonly
	}

	render() {
		console.log(this.readonly ? this.label : this.fallback)
		return (
			<Button disabled={this.disabled} type="button">
				{this.readonly ? this.label : this.fallback}
				<slot />
			</Button>
		)
	}
}
