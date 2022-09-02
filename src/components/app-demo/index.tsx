import { Component, h, Prop } from "@stencil/core"
import { redirect } from "../../index"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { App } from "../App"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	@Prop() baseUrl: string
	render() {
		return (
			<App label="Smoothly Demo">
				<a slot="nav-start" href="display">
					Display
				</a>
				<a slot="nav-start" href="https://google.com">
					External
				</a>
				<smoothly-room path="">
					<smoothly-input type="text">Default</smoothly-input>
					<div style={{ padding: "1em", maxWidth: "12em" }}>
						<smoothly-button fill="solid" color="danger" link="https://google.com">
							open
						</smoothly-button>
						<smoothly-button
							fill="solid"
							color="danger"
							link="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
							download={true}>
							download
						</smoothly-button>
						<smoothly-button fill="solid" color="danger" onClick={() => alert("clicked")}>
							action
						</smoothly-button>
						<smoothly-button type="link" fill="clear" color="danger" onClick={() => alert("clicked")}>
							action link
						</smoothly-button>
					</div>
				</smoothly-room>
				<smoothly-room path="input" label="Input">
					<smoothly-input-demo />
				</smoothly-room>
				<smoothly-room path="dialog" label="Dialog">
					<smoothly-dialog-demo />
				</smoothly-room>
				<smoothly-room path="display" label="Display" icon="eye-outline">
					<smoothly-display-demo />
				</smoothly-room>
				<smoothly-room path="table" label="Table">
					<smoothly-table-demo />
				</smoothly-room>
				<smoothly-room path="select" label="Select">
					<smoothly-select-demo />
				</smoothly-room>
				<smoothly-room path="icon" label="Icon">
					<smoothly-icon-demo />
				</smoothly-room>
				<smoothly-room path="/redirect" label="Redirect">
					<smoothly-button
						style={{ "max-width": "300px" }}
						onClick={() => {
							redirect("/routing/pathParameter1")
						}}>
						Internal
					</smoothly-button>
					<smoothly-button
						style={{ "max-width": "300px" }}
						onClick={() => {
							redirect("https://google.com")
						}}>
						External
					</smoothly-button>
				</smoothly-room>
				<smoothly-room path={/^\/routing\/\w+\/?/} label="No effect">
					<h2>Regex routing</h2>
				</smoothly-room>
				<smoothly-room path="old" label="Old" to="select"></smoothly-room>
				<span slot="header" style={{ width: "100%", maxWidth: "500px" }}>
					<smoothly-picker
						label="All Animals Selected"
						style={{ minWidth: "100px" }}
						labelSetting="hide"
						empty-menu-label="Sorry, we're out of options."
						max-height="58px"
						multiple={true}
						select-none-name="Select All"
						options={[
							{ name: "Big Dog", value: "dog", aliases: ["WOFF"] },
							{ name: "Cat Stevens", value: "cat", aliases: ["moew"], hint: "moew 🐈" },
							{ name: "Noble Pig", value: "pig", hint: "🐷" },
							{ name: "Turtle Wax", value: "turtle" },
							{ name: "Spider Man", value: "spider" },
							{ name: "Phoenix Order Long Wooord", value: "phoenix" },
							{ name: "Horse Back", value: "horse" },
							{ name: "Unicorn Horn", value: "unicorn" },
							{ name: "Talking Parrot Parrot", value: "parrot" },
							{ name: "Hidden Dragon", value: "dragon" },
							{ name: "Scary Kraken", value: "kraken" },
						]}></smoothly-picker>
				</span>
				<smoothly-trigger slot="header" type="link" name="logout">
					<smoothly-icon toolTip={"Log out"} name="log-out" size="medium"></smoothly-icon>
				</smoothly-trigger>
			</App>
		)
	}
}
