import { Component, Event, EventEmitter, h, Host, Listen, State } from "@stencil/core"

@Component({
	tag: "smoothly-routing-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRoutingDemo {
	private path = "/routing"
	@Event() smoothlyUrlUpdate: EventEmitter<{ path: string; query?: string; pathParams?: string }>
	@State() query?: string
	@State() pathParams?: string
	componentWillLoad() {
		if (window.location.pathname.startsWith(this.path)) {
			this.query = window.location.search.replace("?", "")
			this.pathParams = window.location.pathname.slice(this.path.length).replace(/^\/+/, "")
			if (this.query || this.pathParams)
				this.smoothlyUrlUpdate.emit({ query: this.query, path: this.path, pathParams: this.pathParams })
		}
	}
	@Listen("smoothlyUrlChange", { target: "window" })
	urlChangeHandler(event: CustomEvent<string>) {
		const url = new URL(event.detail)
		if (url.pathname.startsWith(this.path)) {
			this.query = url.search.replace("?", "")
			this.pathParams = window.location.pathname.slice(this.path.length).replace(/^\/+/, "")
		}
	}

	render() {
		return (
			<Host>
				<smoothly-button color="warning" onClick={() => this.smoothlyUrlUpdate.emit({ query: "a=b", path: this.path })}>
					Add query
				</smoothly-button>
				<smoothly-button color="warning" onClick={() => this.smoothlyUrlUpdate.emit({ query: "", path: this.path })}>
					Remove query
				</smoothly-button>
				<smoothly-button
					color="warning"
					onClick={() => this.smoothlyUrlUpdate.emit({ path: this.path, pathParams: "123" })}>
					Add path parameter
				</smoothly-button>
				<smoothly-button
					color="warning"
					onClick={() => this.smoothlyUrlUpdate.emit({ path: this.path, pathParams: "" })}>
					Remove path parameter
				</smoothly-button>
				<div>
					<p>Path param: {this.pathParams} </p>
					<p>Query params: {this.query}</p>
				</div>
			</Host>
		)
	}
}
