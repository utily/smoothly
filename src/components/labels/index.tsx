import { Component, h, Host, Prop } from "@stencil/core"
import { Label } from "./label/Label"
@Component({
	tag: "smoothly-labels",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyLabels {
	@Prop() labels: Label.Interactive[] = []
	@Prop() readonly: boolean
	@Prop({ reflect: true }) wrap: "wrap" | "nowrap" = "wrap"
	@Prop({ reflect: true }) shape: "rectangle" | "rounded"

	render() {
		const enabled: HTMLSmoothlyLabelsLabelElement[] = []
		const disabled: HTMLSmoothlyLabelsLabelElement[] = []
		this.labels.forEach(label =>
			label.status == "disabled"
				? disabled.push(<smoothly-labels-label label={label} readonly={this.readonly} shape={this.shape} />)
				: enabled.push(<smoothly-labels-label label={label} readonly={this.readonly} shape={this.shape} />)
		)
		return (
			<Host>
				{enabled.length > 0 && <div>{enabled}</div>}
				{disabled.length > 0 && <div>{disabled}</div>}
			</Host>
		)
	}
}
