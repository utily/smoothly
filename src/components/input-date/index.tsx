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
			<smoothly-input
				onClick={() => (this.open = !this.open)}
				type="date"
				value={this.value}
				onSmoothlyChanged={e => (this.value = e.detail.value)}>
				<slot></slot>
			</smoothly-input>,
			this.open ? <div onClick={() => (this.open = false)}></div> : [],
			this.open ? (
				<nav>
					<div class="arrow"></div>
					<smoothly-calendar
						doubleInput={false}
						value={this.value ?? Date.now()}
						onValueChanged={event => {
							this.value = event.detail
							event.stopPropagation()
						}}></smoothly-calendar>
				</nav>
			) : (
				[]
			),
		]
	}
}
