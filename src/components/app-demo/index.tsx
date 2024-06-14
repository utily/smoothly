import { Component, h, Prop } from "@stencil/core"
import { redirect } from "../../index"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { App } from "../App"

@Component({
	tag: "smoothly-0-app-demo",
})
export class Smoothly0AppDemo {
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
				<smoothly-0-room path="">
					<smoothly-0-input type="text">Default</smoothly-0-input>
					<div style={{ padding: "1em", maxWidth: "12em" }}>
						<smoothly-0-button fill="solid" color="danger" link="https://google.com">
							open
						</smoothly-0-button>
						<smoothly-0-button
							fill="solid"
							color="danger"
							link="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
							download={true}>
							download
						</smoothly-0-button>
						<smoothly-0-button fill="solid" color="danger" onClick={() => alert("clicked")}>
							action
						</smoothly-0-button>
						<smoothly-0-button disabled fill="solid" color="danger" onClick={() => alert("clicked")}>
							action
						</smoothly-0-button>
						<smoothly-0-button type="link" fill="clear" color="danger" onClick={() => alert("clicked")}>
							action link
						</smoothly-0-button>
					</div>
				</smoothly-0-room>
				<smoothly-0-room path="input" label="Input">
					<smoothly-0-input-demo />
				</smoothly-0-room>
				<smoothly-0-room path="dialog" label="Dialog">
					<smoothly-0-dialog-demo />
				</smoothly-0-room>
				<smoothly-0-room path="display" label="Display" icon="eye-outline">
					<smoothly-0-display-demo />
				</smoothly-0-room>
				<smoothly-0-room path="table" label="Table">
					<smoothly-0-table-demo />
				</smoothly-0-room>
				<smoothly-0-room path="select" label="Select">
					<smoothly-0-select-demo />
				</smoothly-0-room>
				<smoothly-0-room path="icon" label="Icon">
					<smoothly-0-icon-demo />
				</smoothly-0-room>
				<smoothly-0-room path="/redirect" label="Redirect">
					<smoothly-0-button
						style={{ "max-width": "300px" }}
						onClick={() => {
							redirect("/routing/pathParameter1")
						}}>
						Internal
					</smoothly-0-button>
					<smoothly-0-button
						style={{ "max-width": "300px" }}
						onClick={() => {
							redirect("https://google.com")
						}}>
						External
					</smoothly-0-button>
					<smoothly-0-button
						disabled
						style={{ "max-width": "300px" }}
						onClick={() => {
							redirect("https://google.com")
						}}>
						External
					</smoothly-0-button>
				</smoothly-0-room>
				<smoothly-0-room path={/^\/routing\/\w+\/?/} label="No effect">
					<h2>Regex routing</h2>
				</smoothly-0-room>
				<smoothly-0-room path="old" label="Old" to="select"></smoothly-0-room>
				<span slot="header" style={{ width: "100%", maxWidth: "500px" }}>
					<smoothly-0-picker
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
						]}></smoothly-0-picker>
				</span>
				<smoothly-0-trigger slot="header" type="link" name="logout">
					<smoothly-0-icon toolTip={"Log out"} name="log-out" size="medium"></smoothly-0-icon>
				</smoothly-0-trigger>
			</App>
		)
	}
}
