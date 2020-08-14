// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, h } from "@stencil/core"

import { App } from "../App"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	@Prop() baseUrl: string
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
			<a slot="nav-start" href="display">Display</a>
			<a slot="nav-start" href="https://google.com">External</a>
			<smoothly-trigger slot="nav-end" type="link" fill="clear" name="logout"><smoothly-icon toolTip={ "Log out" } name="log-out" size="medium" fill="clear" color="light"></smoothly-icon></smoothly-trigger>
			<smoothly-room path="">
				<smoothly-input type="text">Default</smoothly-input>
			</smoothly-room>
			<smoothly-room path="input" label="Input">
				<smoothly-input-demo />
			</smoothly-room>
			<smoothly-room path="display" label="Display">
				<smoothly-display-demo />
			</smoothly-room>
			<smoothly-room path="select" label="Select">
				<smoothly-select-demo />
			</smoothly-room>
			<smoothly-room path="icon" label="Icon">
				<smoothly-icon-demo />
			</smoothly-room>
			<smoothly-room path="old" label="Old" to="select"></smoothly-room>
		</App>
	}
}


