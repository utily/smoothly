import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo-card",
	scoped: true,
})
export class SmoothlyFormDemoCard {
	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Card</h2>
				<smoothly-form looks="grid" onSmoothlyFormSubmit={(e: CustomEvent) => alert(JSON.stringify(e.detail))}>
					<smoothly-input type="card-number" name="card">
						Card #
					</smoothly-input>
					<smoothly-input-submit size="icon" slot="submit" color="success" fill="solid" />
					<smoothly-input type="card-expires" name="expires">
						Expires
					</smoothly-input>
					<smoothly-input type="card-csc" name="csc">
						CVV/CVC
					</smoothly-input>
					<smoothly-input type="text" name="name.first">
						First Name
					</smoothly-input>
					<smoothly-input type="text" name="name.last">
						Last Name
					</smoothly-input>
				</smoothly-form>
			</Host>
		)
	}
}
