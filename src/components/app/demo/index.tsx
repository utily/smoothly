import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	@Prop() baseUrl: string
	app?: HTMLSmoothlyAppElement
	render() {
		return (
			<smoothly-app color="dark" label="Smoothly Demo" home="/root" ref={e => (this.app = e)}>
				<smoothly-trigger slot="nav-start" type="link" name="logout">
					<smoothly-icon toolTip={"Log out"} name="log-out" size="medium"></smoothly-icon>
				</smoothly-trigger>
				<smoothly-app-room path="/root" label="root">
					<smoothly-theme-demo />
				</smoothly-app-room>
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
							type="download">
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
				<smoothly-app-room path="/next" label="Next">
					<smoothly-next-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/tabs" label="Tabs">
					<smoothly-tabs-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/icon" label="Icon" content={<smoothly-icon-demo />}></smoothly-app-room>
				<smoothly-app-room path="/redirect" label="Redirect">
					<smoothly-button type="link" link="/input">
						To input
					</smoothly-button>
					<smoothly-button type="link" link="../button">
						To button
					</smoothly-button>
					<smoothly-button type="link" link={new URL("/hidden", window.location.origin).href}>
						To hidden
					</smoothly-button>
					<smoothly-button type="link" link="/redirect">
						To redirect
					</smoothly-button>
					<smoothly-button type="link" link="nested">
						To redirect nested, relative path
					</smoothly-button>
				</smoothly-app-room>
				<smoothly-app-room path="/hidden">
					<p>hello world!</p>
				</smoothly-app-room>
				<smoothly-app-room path="/redirect/nested">this is a nested room</smoothly-app-room>
			</smoothly-app>
		)
	}
}