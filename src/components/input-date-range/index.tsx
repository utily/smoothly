import { Component, Event, EventEmitter, h, Listen, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"

@Component({
	tag: "smoothly-input-date-range",
	styleUrl: "style.css",
	scoped: true,
})
export class InputDateRange {
	@Prop({ mutable: true }) value?: Date
	@Prop({ mutable: true }) start?: Date
	@Prop({ mutable: true }) end?: Date
	@Prop({ mutable: true }) open: boolean
	@Event() valueChanged: EventEmitter<Date>
	@Event() dateRangeSelected: EventEmitter<{ start: Date; end: Date }>

	@Watch("value")
	onValue(next: Date) {
		this.valueChanged.emit(next)
	}

	@Watch("open")
	@Watch("start")
	@Watch("end")
	onClose(open: boolean) {
		if (open == false && Date.is(this.start) && Date.is(this.end)) {
			this.dateRangeSelected.emit({ start: this.start, end: this.end })
		}
	}

	@Listen("startChanged")
	onStartChanged(event: CustomEvent<Date>) {
		this.start = event.detail
	}
	@Listen("endChanged")
	onEndChanged(event: CustomEvent<Date>) {
		this.end = event.detail
	}
	render() {
		return [
			<section>
				<smoothly-input
					onClick={() => (this.open = !this.open)}
					type="date"
					value={this.start}
					onSmoothlyChanged={e => (this.start = e.detail.value)}>
					From
				</smoothly-input>
				<smoothly-input
					onClick={() => (this.open = !this.open)}
					type="date"
					value={this.end}
					onSmoothlyChanged={e => (this.end = e.detail.value)}>
					to
				</smoothly-input>
			</section>,
			this.open ? <div onClick={() => (this.open = false)}></div> : [],
			this.open ? (
				<nav>
					<div class="arrow"></div>
					<smoothly-calendar
						doubleInput={true}
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
