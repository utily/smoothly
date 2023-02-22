import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	@Prop() baseUrl: string
	render() {
		return (
			<smoothly-app color="success" label="Smoothly Demo">
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
				<smoothly-app-room path="/display" label="Display" icon="eye-outline">
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
			</smoothly-app>
		)
	}
}
