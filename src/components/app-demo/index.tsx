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
				<nav>
					<ul>
						<li><stencil-route-link url="/input">Input</stencil-route-link></li>
					</ul>
				</nav>
			</header>
			<stencil-router titleSuffix=" - Smoothly App">
				<stencil-route-switch>
					<stencil-route url="/" component="smoothly-adresses" exact={ true } />
					<stencil-route url="/input" component="smoothly-input-demo" />
				</stencil-route-switch>
			</stencil-router>
		</smoothly-app>
	}
}


