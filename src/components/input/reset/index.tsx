import { Component, Event, EventEmitter, h, Host, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { SmoothlyForm } from "../../form"
import { Editable } from "../Editable"
import { Input } from "../Input"

@Component({
	tag: "smoothly-input-reset",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputReset {
	readonlyAtLoad: boolean
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "clear"
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true }) size: "small" | "large" | "icon" | "flexible"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true, mutable: true }) display = true
	@Prop({ reflect: true }) type: "form" | "input" = "input"
	@Prop() tooltip = "Reset"
	private parent?: Editable.Element
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>

	async componentWillLoad() {
		this.smoothlyInputLoad.emit(parent => {
			if (Editable.Element.type.is(parent)) {
				this.parent = parent
				this.readonlyAtLoad = parent.readonly
				parent.listen("changed", async p => {
					if (Input.is(p)) {
						this.display = p.readonly ? false : p.changed
					}
					if (p instanceof SmoothlyForm) {
						this.display = !p.readonly
						this.disabled = !this.readonlyAtLoad && !p.changed
					}
				})
			}
		})
	}
	@Listen("click")
	clickHandler(event: MouseEvent) {
		event.stopPropagation()
		this.parent?.reset()
		this.parent instanceof SmoothlyForm && this.readonlyAtLoad && this.parent?.edit(false)
	}
	render() {
		return (
			<Host title={this.tooltip}>
				<Button disabled={this.disabled} type="button">
					<smoothly-icon class="default" name="refresh-outline" fill="solid" size="tiny" />
				</Button>
			</Host>
		)
	}
}
