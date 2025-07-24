import { Component, h, Host, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-input-copy",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputCopy {
	@Prop() value?: string
	@State() copied = false

	copyText(value?: string) {
		if (value) {
			navigator.clipboard.writeText(value)
			this.copied = true
		}
	}
	render() {
		return (
			<Host>
				<slot />
				{this.value && (
					<span>
						<small slot={"end"}>{this.copied ? "Copied!" : "Copy"}</small>
						<smoothly-icon
							slot="end"
							name="copy-outline"
							size="small"
							onClick={() => this.copyText(this.value ?? "")}
							onMouseLeave={() => (this.copied = false)}
						/>
					</span>
				)}
			</Host>
		)
	}
}
