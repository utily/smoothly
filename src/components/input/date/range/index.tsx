import { Component, Event, EventEmitter, Fragment, h, Host, Listen, Prop, Watch } from "@stencil/core"
import { Date, DateRange } from "isoly"

@Component({
	tag: "smoothly-input-date-range",
	styleUrl: "style.scss",
	scoped: true,
})
export class InputDateRange {
	@Prop({ mutable: true }) name: string
	@Prop({ mutable: true }) start?: Date
	@Prop({ mutable: true }) end?: Date
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) disabled: boolean
	@Prop() labelStart = "from"
	@Prop() labelEnd = "to"
	@Event() smoothlyInput: EventEmitter<{
		[name: string]: { start: Date | undefined; end: Date | undefined } | undefined
	}>
	@Event() smoothlyChange: EventEmitter<{
		[name: string]: { start: Date | undefined; end: Date | undefined } | undefined
	}>
	@Event() smoothlyFormInput: EventEmitter<void>
	componentWillLoad() {
		this.smoothlyFormInput.emit()
		this.smoothlyInput.emit({ [this.name]: this.start && this.end ? { start: this.start, end: this.end } : undefined })
	}
	@Watch("end")
	@Watch("start")
	onValue(next: Date, pre: Date | undefined) {
		if (next !== pre)
			this.smoothlyChange.emit({ [this.name]: { start: this.start, end: this.end } })
		this.smoothlyInput.emit({ [this.name]: { start: this.start, end: this.end } })
	}
	@Listen("startChanged")
	onStartChanged(event: CustomEvent<Date>) {
		this.start = event.detail
	}
	@Listen("endChanged")
	onEndChanged(event: CustomEvent<Date>) {
		this.end = event.detail
	}
	@Listen("dateRangeSet")
	onDateRangeSet(event: CustomEvent<DateRange>) {
		this.open = false
		event.stopPropagation()
	}
	@Listen("smoothlyInput")
	@Listen("smoothlyChange")
	abortEvent(e: CustomEvent) {
		if ("start" in e.detail || "end" in e.detail) {
			e.preventDefault()
			e.stopPropagation()
		}
	}
	render() {
		return (
			<Host>
				<fieldset onClick={() => (this.open = !this.open)}>
					<smoothly-form-controll label={this.labelStart}>
						<smoothly-input
							readonly
							disabled={this.disabled}
							type="date"
							name="start"
							value={this.start}
							onSmoothlyInput={e => {
								this.start = e.detail.start
							}}
						/>
					</smoothly-form-controll>
					<smoothly-form-controll label={this.labelEnd}>
						<smoothly-input
							readonly
							disabled={this.disabled}
							type="date"
							name="end"
							value={this.end}
							onSmoothlyInput={e => {
								this.end = e.detail.end
							}}
						/>
					</smoothly-form-controll>
				</fieldset>

				{this.open && !this.disabled && (
					<Fragment>
						<div class="overlayer" onClick={() => (this.open = false)}></div>
						<div class="container">
							<div class="arrow"></div>
							<smoothly-calendar
								value={this.start ?? undefined}
								doubleInput={true}
								start={this.start}
								end={this.end}
								max={this.max}
								min={this.min}
							/>
						</div>
					</Fragment>
				)}
			</Host>
		)
	}
}
