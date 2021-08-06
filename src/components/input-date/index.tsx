import { Component, Event, EventEmitter, h, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"

@Component({
	tag: "smoothly-input-date",
	styleUrl: "style.css",
	scoped: true,
})
export class InputDate {
	@Prop({ mutable: true }) value?: Date
	@Prop({ mutable: true }) open: boolean
	@Event() valueChanged: EventEmitter<Date>
	@Watch("value")
	onStart(next: Date) {
		this.valueChanged.emit(next)
	}
	render() {
		return [
			this.open ? <div onClick={() => ((this.open = false), console.log("?", this.open))}></div> : [],
			<smoothly-input
				onClick={() => (this.open = true)}
				type="date"
				value={this.value}
				onChange={e => (this.value = (e.target as HTMLSmoothlyInputElement).value)}>
				<slot></slot>
			</smoothly-input>,
			this.open ? (
				<smoothly-calendar
					value={this.value ?? Date.now()}
					onValueChanged={event => {
						this.value = event.detail
						event.stopPropagation()
					}}></smoothly-calendar>
			) : (
				[]
			),
		]
	}
}
