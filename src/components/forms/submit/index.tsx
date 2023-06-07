import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Submitable } from "../Submitable"

@Component({
	tag: "smoothly-submit-new",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlySubmitNew {
	@Prop({ reflect: true }) color?: Color = "success"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop() prevent = true
	@Event() smoothlySubmit: EventEmitter
	private parent?: Submitable
	@Event() smoothlyButtonLoad: EventEmitter<(parent: HTMLElement) => void>

	async componentWillLoad() {
		this.smoothlyButtonLoad.emit(parent => {
			if (Submitable.is(parent)) {
				this.parent = parent
				parent.listen("valid", async p => {
					if (!(await p.isValid()))
						this.disabled = true
					else
						this.disabled = false
				})
			}
		})
	}

	@Listen("click")
	clickHandler() {
		this.parent?.submit()
	}

	render() {
		return (
			<Button disabled={this.disabled} type={this.type} action="submit">
				<slot />
			</Button>
		)
	}
}
