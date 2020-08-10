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
		return <App label="Smoothly Demo">
			<smoothly-select identifier="language" slot="header" background="rgb(var(--smoothly-app-background))">
				<optgroup label="Nordic">
					<option value="sv">Swedish</option>
					<option value="da" selected>Danish</option>
					<option value="no">Norwegian</option>
				</optgroup>
				<optgroup label="Other">
					<option value="en">English</option>
				</optgroup>
			</smoothly-select>
			<a slot="nav-start" href="/display">Display</a>
			<smoothly-trigger slot="nav-end" type="link" fill="clear" name="logout"><smoothly-icon toolTip={ "Log out" } name="log-out" size="medium" fill="clear" color="light"></smoothly-icon></smoothly-trigger>
			<smoothly-room path="/">
				<smoothly-login />
			</smoothly-room>
			<smoothly-room path="/input" label="Input">
				<smoothly-input-demo />
			</smoothly-room>
			<smoothly-room path="/display" label="Display">
				<smoothly-display-demo />
			</smoothly-room>
			<smoothly-room path="/select" label="Select">
				<smoothly-select-demo />
			</smoothly-room>
			<smoothly-room path="/icon" label="Icon">
				<smoothly-icon-demo />
			</smoothly-room>
		</App>
	}
}


