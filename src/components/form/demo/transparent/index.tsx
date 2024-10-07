import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo-transparent",
	scoped: true,
})
export class SmoothlyFormDemoTransparent {
	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Transparent</h2>
				<smoothly-form looks={"transparent"} onSmoothlyFormSubmit={e => console.log(e.detail.value)}>
					<smoothly-input-file name={"file"}>
						<span slot={"label"}>File</span>
						<smoothly-icon slot={"button"} name={"folder-open-outline"} size={"small"} />
					</smoothly-input-file>
					<smoothly-input type={"duration"} looks={"transparent"} placeholder={"h:mm"}>
						Input
					</smoothly-input>
					<smoothly-input-date>Date</smoothly-input-date>
					<smoothly-input-date-range>Date Range</smoothly-input-date-range>
					<smoothly-input-select name={"transport"}>
						<smoothly-item value={"plane"}>
							<smoothly-icon name={"airplane-outline"} />
						</smoothly-item>
						<smoothly-item value={"car"}>
							<smoothly-icon name={"car-outline"} />
						</smoothly-item>
						<smoothly-item value={"bus"} selected>
							<smoothly-icon name={"bus-outline"} />
						</smoothly-item>
					</smoothly-input-select>
					<smoothly-input-submit icon={"checkbox-outline"} />
				</smoothly-form>
			</Host>
		)
	}
}
