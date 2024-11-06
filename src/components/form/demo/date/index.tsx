import { Component, Event, EventEmitter, h, Host, VNode } from "@stencil/core"
import { isoly } from "isoly"
import { isly } from "isly"
import { Notice, Submit } from "../../../../model"

@Component({
	tag: "smoothly-form-demo-date",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoDate {
	@Event() notice: EventEmitter<Notice>
	private validator = isly.object<{ date: isoly.Date; range: isoly.DateRange }>({
		date: isly.fromIs("isoly.Date", isoly.Date.is),
		range: isly.fromIs("isoly.DateRange", isoly.DateRange.is),
	})
	async submitHandler(event: CustomEvent<Submit>): Promise<void> {
		event.stopPropagation()
		if (!this.validator.is(event.detail.value)) {
			console.error(`Type is incomplete.`)
			this.notice.emit(Notice.failed(`Type is incomplete.`))
		} else {
			this.notice.emit(Notice.succeeded(`Type is complete!`))
			event.detail.result(true)
		}
		event.detail.result(false)
	}
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-form
					looks={"border"}
					type={"create"}
					onSmoothlyFormInput={e => console.log("form input", e.detail)}
					onSmoothlyFormSubmit={e => this.submitHandler(e)}>
					<smoothly-input-date name={"date"}>{"Date"}</smoothly-input-date>
					<smoothly-input-date-range name={"range"}>{"Range"}</smoothly-input-date-range>
					<smoothly-input-submit slot={"submit"}>
						<smoothly-icon name={"checkmark-outline"} />
					</smoothly-input-submit>
				</smoothly-form>
			</Host>
		)
	}
}
