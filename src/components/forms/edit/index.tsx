import { Component, Event, EventEmitter, h, Listen, Prop, State } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Editable } from "../Editable"
import { SmoothlyFormNew } from "../form"
import { Resetable } from "../Resetable"

interface Form extends Editable, Resetable {}

@Component({
	tag: "smoothly-edit",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyEdit {
	@Prop() label?: string | HTMLElement
	@Prop() fallback?: string
	@Prop({ reflect: true }) color?: Color = "light"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "default"
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true, mutable: true }) reactive?: boolean
	@State() readonly?: boolean
	@Event() smoothlyButtonLoad: EventEmitter<(parent: HTMLElement) => void>
	private parent: Form
	private state: { [key: string]: any }

	componentWillLoad() {
		this.smoothlyButtonLoad.emit(parent => {
			if (Editable.is(parent) && Resetable.is(parent)) {
				this.parent = parent
				this.readonly = parent.readonly
				if (parent instanceof SmoothlyFormNew && parent.reactive)
					this.reactive = true
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
		return (
			<Button disabled={this.disabled} type="button">
				{this.readonly ? (
					this.reactive ? (
						<smoothly-icon size="tiny" name="lock-closed" />
					) : (
						this.label
					)
				) : this.reactive ? (
					<smoothly-icon size="tiny" name="lock-open" />
				) : (
					this.fallback
				)}
				<slot />
			</Button>
		)
	}
}
