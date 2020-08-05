// tslint:disable-next-line: no-implicit-dependencies
import { Component, h } from "@stencil/core"
// tslint:disable-next-line: no-implicit-dependencies
import "@stencil/router"

@Component({
	tag: "smoothly-app-demo",
})
export class SmoothlyAppDemo {
	render() {
		return <smoothly-app>
			<header>
				<h1><stencil-route-link url="/">Smoothly App</stencil-route-link></h1>
				<p>Center</p>
				<nav>
					<ul>
						<li><stencil-route-link url="/input">Input</stencil-route-link></li>
						<li><stencil-route-link url="/display">Display</stencil-route-link></li>
						<li><stencil-route-link url="/select">Select</stencil-route-link></li>
						<li><stencil-route-link url="/icon">Icon</stencil-route-link></li>
						<li><smoothly-trigger type="link" fill="clear" name="logout"><smoothly-icon toolTip={ "Log out" } name="log-out" size="medium" fill="clear" color="light"></smoothly-icon></smoothly-trigger></li>
					</ul>
				</nav>
			</header>
			<stencil-router titleSuffix=" - Smoothly App">
				<stencil-route-switch>
					<stencil-route url="/" component="smoothly-login" exact={ true } />
					<stencil-route url="/input" component="smoothly-input-demo" />
					<stencil-route url="/display" component="smoothly-display-demo" />
					<stencil-route url="/select" component="smoothly-select-demo" />
					<stencil-route url="/icon" component="smoothly-icon-demo" />
				</stencil-route-switch>
			</stencil-router>
		</smoothly-app>
	}
}


