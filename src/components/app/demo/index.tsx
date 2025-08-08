import { Component, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	@Prop() baseUrl: string
	app?: HTMLSmoothlyAppElement
	@Listen("smoothlyUrlChange", { target: "window" })
	urlChangeHandler(event: CustomEvent<string>) {
		console.log("smoothlyUrlChange", event.detail)
	}
	render() {
		return (
			<smoothly-app color="dark" label="Smoothly Demo" home="/root" ref={e => (this.app = e)}>
				<smoothly-app-room path="/">
					<section style={{ padding: "1em", maxWidth: "32em", margin: "0 auto" }}>
						<header>
							<h1>Welcome</h1>
						</header>
						<p>
							Smoothly is a component library written in <a href="http://stenciljs.com">Stencil</a>. It can therefore be
							used across web based frontend toolchains such as React, Vue, Angular, Svelte, and even plain HTML.
						</p>
						<p>
							This is particularly useful when trying to unifying the user experience across projects written in
							different technology stacks. It is also written to minimize the amount of code you need to write to
							achieve a nice user experience.
						</p>
					</section>
				</smoothly-app-room>
				<smoothly-app-room path="/form" label="Forms" content={<smoothly-form-demo />} />
				<smoothly-app-room path="/input" label="Inputs" content={<smoothly-input-demo />} />
				<smoothly-app-room path="/table" label="Tables" content={<smoothly-table-demo />} />
				<smoothly-app-room path="/button" label="Buttons" content={<smoothly-button-demo />} />
				<smoothly-app-room path="/icon" label="Icons" content={<smoothly-icon-demo />} />
				<smoothly-app-room path="/theme" label="Theming" content={<smoothly-theme-demo />} />
				<smoothly-app-room path="/dialog" label="Dialogs" content={<smoothly-dialog-demo />} slot="nav-end" />
				<smoothly-app-room path="/display" label="Display" content={<smoothly-display-demo />} slot="nav-end" />
				<smoothly-app-room path="/tabs" label="Tabs" slot="nav-end">
					<smoothly-tabs-demo />
				</smoothly-app-room>
				<smoothly-app-room path="/links" label="Links" slot="nav-end">
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
				<smoothly-app-room path="/redirect" label="Redirect" slot="nav-end">
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
