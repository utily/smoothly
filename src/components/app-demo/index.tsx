import { Component, h, Prop } from "@stencil/core"
import { redirect } from "../../model"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	@Prop() baseUrl: string

	render() {
		return (
			<smoothly-app color="dark" label="Smoothly Demo">
				<smoothly-trigger slot="nav-start" type="link" name="logout">
					<smoothly-icon toolTip={"Log out"} name="log-out" size="medium"></smoothly-icon>
				</smoothly-trigger>
				<smoothly-app-room path="/links" label="Links">
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
						<smoothly-button disabled fill="solid" color="danger" onClick={() => alert("clicked")}>
							action
						</smoothly-button>
						<smoothly-button type="link" fill="clear" color="danger" onClick={() => alert("clicked")}>
							action link
						</smoothly-button>
					</div>
				</smoothly-app-room>
				<smoothly-app-room path="/input" label="Input">
					<smoothly-input-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/button" label="Button">
					<smoothly-button-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/dialog" label="Dialog">
					<smoothly-dialog-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/display">
					<smoothly-display-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/table" label="Table">
					<smoothly-table-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/select" label="Select">
					<smoothly-select-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/icon" label="Icon">
					<smoothly-icon-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/old" label="Old" to="select"></smoothly-app-room>
				<smoothly-app-room path="/redirect" label="Redirect">
					<smoothly-button onClick={() => redirect("/input")}>To input</smoothly-button>
					<smoothly-button onClick={() => redirect("/button")}>To button</smoothly-button>
					<smoothly-button onClick={() => redirect("/hidden")}>To hidden</smoothly-button>
				</smoothly-app-room>
				<smoothly-app-room path="/hidden">
					<p>hello world!</p>
				</smoothly-app-room>
			</smoothly-app>
		)
	}
}
