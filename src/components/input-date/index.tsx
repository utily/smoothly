import { Component, Event, EventEmitter, h, Listen, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"

@Component({
	tag: "smoothly-input-date",
	styleUrl: "style.css",
	scoped: true,
})
export class InputDate {
	@Prop({ mutable: true }) value?: Date
	@Prop({ mutable: true }) month?: Date
	@Prop({ mutable: true }) open: boolean
	@Event() inputChanged: EventEmitter<Date>
	@Watch("value")
	@Watch("month")
	onStart(next: Date) {
		this.inputChanged.emit(next)
	}
	@Listen("dateChanged")
	onDateChanged(event: CustomEvent<Date>) {
		this.value = event.detail
	}
	@Listen("valueChanged")
	onValueChanged(event: CustomEvent<Date>) {
		this.month = event.detail
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
			this.open ? <smoothly-calendar month={this.month ?? this.value ?? Date.now()}></smoothly-calendar> : [],
		]
	}
}
