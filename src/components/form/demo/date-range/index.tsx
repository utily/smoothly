import { Component, Event, EventEmitter, h, Host, VNode } from "@stencil/core"
import { isoly } from "isoly"
import { isly } from "isly"
import { Notice, Submit } from "../../../../model"

@Component({
	tag: "smoothly-form-demo-date-range",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoDateRange {
	@Event() notice: EventEmitter<Notice>
	private validator = isly.object<{ range: isoly.DateRange }>({
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
					validator={this.validator}
					onSmoothlyFormSubmit={e => this.submitHandler(e)}>
					<smoothly-input-date-range name={"range"}>{"Range"}</smoothly-input-date-range>
					<smoothly-input-submit slot={"submit"}>
						<smoothly-icon name={"checkmark-outline"} />
					</smoothly-input-submit>
				</smoothly-form>
			</Host>
		)
	}
}
