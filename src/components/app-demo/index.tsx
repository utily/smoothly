import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	@Prop() baseUrl: string
	render() {
		return (
			<smoothly-app label="Smoothly Demo">
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
						<smoothly-button disabled fill="solid" color="danger" onClick={() => alert("clicked")}>
							action
						</smoothly-button>
						<smoothly-button type="link" fill="clear" color="danger" onClick={() => alert("clicked")}>
							action link
						</smoothly-button>
					</div>
				</smoothly-room>
				<smoothly-room selected path="input" label="Input">
					<smoothly-input-demo />
				</smoothly-room>
				<smoothly-room path="button" label="Button">
					<smoothly-button-demo />
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
				<smoothly-room path="old" label="Old" to="select"></smoothly-room>
				<smoothly-trigger slot="header" type="link" name="logout">
					<smoothly-icon toolTip={"Log out"} name="log-out" size="medium"></smoothly-icon>
				</smoothly-trigger>
			</smoothly-app>
		)
	}
}
