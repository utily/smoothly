import { Component, Event, EventEmitter, h, Listen, Prop, Watch } from "@stencil/core"
import { Date } from "isoly"
import * as generate from "../../calendar/generate"

@Component({
	tag: "smoothly-input-month",
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

	@Listen("smoothlyChange")
	@Listen("smoothlyBlur")
	@Listen("smoothlyFocus")
	onSmoothlyInput(e: Event) {
		e.preventDefault()
		e.stopPropagation()
	}

	render() {
		let yearValue
		const years = generate.years(this.value ?? Date.now()).map(year => {
			if (year.selected)
				yearValue = year.date
			return { label: year.name, value: year.date }
		})

		let monthValue
		const months = generate.months(this.value ?? Date.now()).map(month => {
			if (month.selected)
				monthValue = month.date
			return { label: month.name, value: month.date }
		})

		return [
			<div onClick={() => this.adjustMonth(-1)}>
				<smoothly-icon name="chevron-back-outline" size="small"></smoothly-icon>
			</div>,
			<div class="relative">
				<smoothly-input-select
					value={yearValue}
					options={years}
					onSmoothlyInput={(e: CustomEvent) => {
						this.value = e.detail
						this.onSmoothlyInput(e)
					}}
				/>
			</div>,
			<div class="relative">
				<smoothly-input-select
					value={monthValue}
					options={months}
					onSmoothlyInput={(e: CustomEvent) => {
						this.value = e.detail
						this.onSmoothlyInput(e)
					}}
				/>
			</div>,
			<div onClick={() => this.adjustMonth(1)}>
				<smoothly-icon name="chevron-forward-outline" size="small"></smoothly-icon>
			</div>,
		]
	}
}
