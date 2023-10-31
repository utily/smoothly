import { Component, Event, EventEmitter, h, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"
import * as generate from "../calendar/generate"

@Component({
	tag: "smoothly-0-input-month",
	styleUrl: "style.css",
	scoped: true,
})
export class MonthSelector {
	@Prop({ mutable: true }) value?: Date
	@Event() valueChanged: EventEmitter<Date>
	@Watch("value")
	onValueChanged(next: Date) {
		this.valueChanged.emit(next)
	}
	private adjustMonth(delta: number) {
		const date = Date.parse(this.value ?? Date.now())
		date.setMonth(date.getMonth() + delta)
		this.value = Date.create(date)
	}
	render() {
		return [
			<div onClick={() => this.adjustMonth(-1)}>
				<smoothly-0-icon name="chevron-back-outline" size="tiny"></smoothly-0-icon>
			</div>,
			<smoothly-0-selector onSelected={(e: CustomEvent) => (this.value = e.detail)}>
				{generate.years(this.value ?? Date.now()).map(year => (
					<smoothly-0-item value={year.date} selected={year.selected}>
						{year.name}
					</smoothly-0-item>
				))}
			</smoothly-0-selector>,
			<smoothly-0-selector onSelected={(e: CustomEvent) => (this.value = e.detail)}>
				{generate.months(this.value ?? Date.now()).map(month => (
					<smoothly-0-item value={month.date} selected={month.selected}>
						{month.name}
					</smoothly-0-item>
				))}
			</smoothly-0-selector>,
			<div onClick={() => this.adjustMonth(1)}>
				<smoothly-0-icon name="chevron-forward-outline" size="tiny"></smoothly-0-icon>
			</div>,
		]
	}
}
