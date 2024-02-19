import { Component, h, Host, Listen, State } from "@stencil/core"
import { Label } from "../label/Label"

@Component({
	tag: "smoothly-labels-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLabelsDemo {
	available: Label.Interactive[] = [
		{
			name: "2fa",
			color: "120",
			description: "User has two factor authentication enabled.",
			status: "enabled",
			submit: false,
		},
		{
			name: "expired",
			color: "240",
			description: "User's password has expired.",
			status: "enabled",
			submit: false,
		},
		{
			name: "inactive",
			color: "60",
			description: "User is inactive.",
			status: "enabled",
			submit: false,
		},
	]
	@State() current?: string[]
	componentWillLoad() {
		this.current = [this.available[0].name]
	}
	@Listen("smoothlyFormSubmit")
	formHandler(event: CustomEvent<{ labels: { enabled: string[]; disabled: string[] } }>) {
		event.stopPropagation()
		this.current = this.current && [
			...new Set(
				this.current.concat(event.detail.labels.enabled).filter(l => !event.detail.labels.disabled.includes(l))
			),
		]
	}
	findAvailableLabel(name: string): Label.Interactive {
		return (
			this.available.find(a => a.name == name) ?? {
				name,
				color: "360",
				description: "",
				status: "enabled",
				submit: false,
			}
		)
	}

	render() {
		return (
			<Host>
				<h2>Labels Demo</h2>
				<h3>Available</h3>
				<smoothly-labels readonly={true} shape={"rectangle"} wrap={"wrap"} labels={this.available}></smoothly-labels>
				<h3>Selected</h3>
				<smoothly-labels
					readonly={true}
					shape={"rectangle"}
					wrap={"wrap"}
					labels={this.current?.map(c => this.findAvailableLabel(c)) ?? []}></smoothly-labels>
				<h3>Form with Label Picker</h3>
				<smoothly-form color="default" name="groups" looks="border">
					<smoothly-label-picker
						labels={this.available}
						input={{ enabled: this.current ?? [], disabled: [] }}
						shape={"rectangle"}
					/>
					<smoothly-submit slot="submit" color="success" size="small" fill="solid">
						Submit
					</smoothly-submit>
				</smoothly-form>
			</Host>
		)
	}
}
