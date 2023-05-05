import { Component, Element, Event, EventEmitter, h, Listen, Prop, Watch } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Clearable } from "../../form/Clearable"

export interface ButtonProps {
	expand?: "block" | "full"
	color?: Color
	fill?: Fill
	type: "link" | "button"
	size?: "flexible" | "small" | "large" | "icon"
	shape?: "rounded"
}

@Component({
	tag: "smoothly-input-clear",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputClear {
	@Prop() value?: any
	@Prop() condition: (a: any) => boolean
	@Prop({ reflect: true }) button: ButtonProps = {
		color: "danger",
		fill: "solid",
		type: "button",
	}
	@Prop({ reflect: true }) icon = true
	@Prop({ reflect: true }) display = true
	@Prop({ mutable: true }) disabled = false
	@Prop({ reflect: true }) name?: string
	@Element() hostElement: HTMLElement
	@Event() smoothlyInputClear: EventEmitter
	@Event() smoothlyInputClearDisplay: EventEmitter<{ name: string | undefined; display: boolean }>

	async componentWillLoad() {
		this.smoothlyInputClearDisplay.emit({ name: this.name, display: this.display })
	}

	@Watch("display")
	onChangeDisplay() {
		this.smoothlyInputClearDisplay.emit({ name: this.name, display: this.display })
	}

	componentWillRender() {
		this.onChangeValue()
	}

	@Watch("value")
	onChangeValue() {
		if (this.icon)
			return (this.display = this.value || false)
	}

	@Listen("click")
	clickHandler() {
		const node = this.hostElement.parentElement
		if (Clearable.is(node))
			return node.clear()
		this.smoothlyInputClear.emit()
	}

	render() {
		return (
			<host>
				{this.icon ? (
					<smoothly-icon name="close" size="tiny"></smoothly-icon>
				) : (
					<smoothly-button disabled={this.disabled} {...this.button}>
						Clear
					</smoothly-button>
				)}
			</host>
		)
	}
}
