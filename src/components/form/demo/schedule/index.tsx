import { Component, h, Host, VNode } from "@stencil/core"
import { isoly } from "isoly"
import { isly } from "isly"

type ScheduledEvent = {
	date: isoly.Date
	amount: number
}
namespace ScheduledEvent {
	export const type = isly.object<ScheduledEvent>({
		date: isly.fromIs("isoly.Date", isoly.Date.is),
		amount: isly.number(),
	})
}

type TimeTable = { schedule: ScheduledEvent[] }
namespace TimeTable {
	export const type = isly.object<TimeTable>({ schedule: ScheduledEvent.type.array() })
}

// This demo demonstrate that the form can handle arrays in the validator
@Component({
	tag: "smoothly-form-demo-schedule",
	scoped: true,
})
export class SmoothlyFormDemoPrices {
	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Schedule</h2>
				<smoothly-form looks="line" validator={TimeTable.type}>
					<smoothly-input-date name="schedule.0.date">Date</smoothly-input-date>
					<smoothly-input name="schedule.0.amount" type="price">
						Amount
					</smoothly-input>
					<smoothly-input-date name="schedule.1.date">Date</smoothly-input-date>
					<smoothly-input name="schedule.1.amount" type="price">
						Amount
					</smoothly-input>
					<smoothly-input-date name="schedule.2.date">Date</smoothly-input-date>
					<smoothly-input name="schedule.2.amount" type="price">
						Amount
					</smoothly-input>
					<smoothly-input-reset slot="reset" fill="default" type="form" color="warning" />
					<smoothly-input-submit slot="submit" />
				</smoothly-form>
			</Host>
		)
	}
}
