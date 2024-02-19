import { Component, Event, EventEmitter, h, Host, Listen, Prop, State } from "@stencil/core"
import { Label } from "../label/Label"

@Component({
	tag: "smoothly-label-picker",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyLabelPicker {
	@Prop() input: { enabled: string[]; disabled: string[] }
	@Prop() labels: Readonly<Label[]>
	@Prop() shape: "rectangle" | "rounded"
	@State() enabled: Label.Interactive[] = []
	@State() disabled: Label.Interactive[] = []
	@Event() smoothlyInput: EventEmitter<{ labels: { enabled: string[]; disabled: string[] } }>

	componentWillLoad(): void {
		this.enabled = this.input.enabled.map(
			(label): Label.Interactive => this.labelNameToInteractive(label, "enabled", false)
		)
		this.disabled = this.input.disabled.map(
			(label): Label.Interactive => this.labelNameToInteractive(label, "disabled", false)
		)
	}
	componentDidRender(): void {
		this.smoothlyInput.emit({
			labels: { enabled: this.enabled.map(l => l.name), disabled: this.disabled.map(l => l.name) },
		})
	}
	@Listen("labelChanged")
	labelChangedHandler(event: CustomEvent<Label.Interactive>) {
		event.stopPropagation()
		event.detail.submit = false
		if (event.detail.status == "enabled") {
			!this.enabled.some(s => s.name == event.detail.name) && (this.enabled = this.enabled.concat(event.detail))
			this.disabled = this.disabled.filter(s => s.name != event.detail.name)
		}
		if (event.detail.status == "disabled") {
			this.enabled = this.enabled.filter(s => s.name != event.detail.name)
			!this.disabled.some(d => d.name == event.detail.name) && (this.disabled = this.disabled.concat(event.detail))
		}
	}
	@Listen("smoothlyChange")
	formChangeHandler(event: CustomEvent<{ labels: Label[] }>): void {
		event.stopPropagation()
		const [selected, deselected] = this.enabled.reduce(
			([selected, deselected], c) => {
				if (!this.labels.some(l => l.name == c.name))
					selected.push(c)
				else
					event.detail.labels.some(l => l.name == c.name)
						? selected.push(c)
						: deselected.push({ ...c, status: "disabled" })
				return [selected, deselected]
			},
			[[], []] as [Label.Interactive[], Label.Interactive[]]
		)
		event.detail.labels.forEach(
			l => !selected.some(s => s.name == l.name) && selected.push({ ...l, status: "enabled", submit: false })
		)
		this.enabled = selected
		this.disabled = this.disabled.filter(d => !selected.some(s => s.name == d.name)).concat(deselected)
	}
	labelNameToInteractive(name: string, status: Label.Interactive["status"], submit: boolean): Label.Interactive {
		const result = this.labels.find(available => available.name == name) ?? {
			name: name,
			description: name,
			color: "1",
		}
		return {
			...result,
			status,
			submit,
		}
	}

	render() {
		return (
			<Host>
				<smoothly-labels labels={this.enabled.concat(this.disabled)} readonly={false} shape={this.shape} />
				<smoothly-picker multiple={true} name="labels" onSmoothlyInput={e => e.stopPropagation()}>
					<span slot="search">Search</span>
					{this.labels.map(label => (
						<smoothly-picker-option
							value={label}
							style={{ stroke: "black" }}
							selected={this.enabled.some(s => s.name == label.name) && !this.disabled.some(s => s.name == label.name)}>
							<smoothly-labels-label
								label={{ ...label, status: "enabled", submit: false }}
								readonly={true}
								shape={this.shape}
							/>
						</smoothly-picker-option>
					))}
				</smoothly-picker>
			</Host>
		)
	}
}
