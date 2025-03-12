import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo-login",
	scoped: true,
})
export class SmoothlyFormDemoLogin {
	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Login</h2>
				<smoothly-form looks="border">
					<smoothly-input type="text" name="username">
						Username
					</smoothly-input>
					<smoothly-input type="password" name="password">
						Password
					</smoothly-input>
					<smoothly-input-reset slot="reset" type="form" size="icon" color="warning" />
					<smoothly-input-submit slot="submit" />
				</smoothly-form>
			</Host>
		)
	}
}
