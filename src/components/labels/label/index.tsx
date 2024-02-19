import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core"
import { Label } from "./Label"

@Component({
	tag: "smoothly-labels-label",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLabelsLabel {
	icon:
		| "remove"
		| "arrow-undo"
		| "remove-circle"
		| "arrow-undo-circle"
		| "add"
		| "close"
		| "add-circle"
		| "close-circle"
	color: string
	@Prop() label: Label.Interactive
	@Prop({ reflect: true }) shape: "rectangle" | "rounded"
	@Prop() readonly: boolean
	@State() clicked = false
	@Event() labelChanged: EventEmitter<Label.Interactive>

	componentWillRender() {
		this.color = this.label && this.label.color
		this.label && this.setIcon()
	}
	buttonClickHandler(event: MouseEvent) {
		event.stopPropagation()
		if (this.label && this.clicked) {
			this.label = Label.switchStatus(this.label)
			this.clicked = false
			this.setIcon()
			this.labelChanged.emit(this.label)
		} else {
			this.clicked = true
			this.setIcon()
			setTimeout(() => ((this.clicked = false), this.setIcon()), 2000)
		}
	}
	setIcon() {
		if (this.label.submit)
			this.icon = `${this.label.status == "added" ? "remove" : "arrow-undo"}${this.clicked ? "-circle" : ""}`
		else
			this.icon = `${this.label.status == "disabled" ? "add" : "close"}${this.clicked ? "-circle" : ""}`
	}
	render() {
		return (
			this.label && (
				<div
					title={this.label.description}
					class={{
						[this.label.status]: true,
						clicked: this.clicked,
						submit: this.label.submit,
					}}
					style={{
						backgroundColor:
							this.label.status == "disabled"
								? `color-mix(in srgb, hsl(${this.color} 85% 70%) 30%, hsl(0 0% 100% / 25%))`
								: `hsl(${this.color} 85% 70%)`,
					}}>
					{this.label.name}
					{!this.readonly && (
						<smoothly-button size="flexible" fill="clear" onClick={e => this.buttonClickHandler(e)}>
							<smoothly-icon
								name={this.icon}
								toolTip={this.label.submit ? "Undo" : this.label.status == "disabled" ? "Add label" : "Remove label"}
								size="tiny"></smoothly-icon>
						</smoothly-button>
					)}
				</div>
			)
		)
	}
}
