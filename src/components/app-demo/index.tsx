// tslint:disable-next-line: no-implicit-dependencies
import { Component, h } from "@stencil/core"
// tslint:disable-next-line: no-implicit-dependencies
import "@stencil/router"

import { App } from "../App"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	render() {
		return <App title="Smoothly Demo">
			<smoothly-room path="/">
				<smoothly-login />
			</smoothly-room>
			<smoothly-room path="/input" title="Input">
				<smoothly-input-demo />
			</smoothly-room>
			<smoothly-room path="/display" title="Display">
				<smoothly-display-demo />
			</smoothly-room>
			<smoothly-room path="/select" title="Select">
				<smoothly-select-demo />
			</smoothly-room>
			<smoothly-room path="/icon" title="Icon">
				<smoothly-icon-demo />
			</smoothly-room>
			<p slot="center">Center</p>
			<smoothly-trigger slot="navigation" type="link" fill="clear" name="logout"><smoothly-icon toolTip={ "Log out" } name="log-out" size="medium" fill="clear" color="light"></smoothly-icon></smoothly-trigger>
		</App>
	}
}


