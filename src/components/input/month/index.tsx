import { Component, Event, EventEmitter, h, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"
import * as generate from "../../calendar/generate"

@Component({
	tag: "smoothly-input-month",
	styleUrl: "style.css",
	scoped: true,
})
export class MonthSelector {
	@Prop({ mutable: true }) value?: Date
	@Event() valueChange: EventEmitter<Date>
	@Watch("value")
	onValueChanged(next: Date) {
		this.valueChange.emit(next)
	}
	private adjustMonth(delta: number) {
		const date = Date.parse(this.value ?? Date.now())
		date.setMonth(date.getMonth() + delta)
		this.value = Date.create(date)
	}
	render() {
		return [
			<div onClick={() => this.adjustMonth(-1)}>
				<smoothly-icon name="caret-back-outline" size="small" />
			</div>,
			<smoothly-input-select onSelect={(e: CustomEvent) => (this.value = e.detail)}>
				{generate.years(this.value ?? Date.now()).map(year => (
					<smoothly-item value={year.date} selected={year.selected}>
						{year.name}
					</smoothly-item>
				))}
			</smoothly-input-select>,
			<smoothly-input-select onSelect={(e: CustomEvent) => (this.value = e.detail)}>
				{generate.months(this.value ?? Date.now()).map(month => (
					<smoothly-item value={month.date} selected={month.selected}>
						{month.name}
					</smoothly-item>
				))}
			</smoothly-input-select>,
			<div onClick={() => this.adjustMonth(1)}>
				<smoothly-icon name="caret-forward-outline" size="small" />
			</div>,
		]
	}
}
