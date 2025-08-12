import { Component, Event, EventEmitter, h, Host, Listen, State } from "@stencil/core"

@Component({
	tag: "smoothly-routing-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRoutingDemo {
	private path = "/routing"
	@Event() smoothlyUrlUpdate: EventEmitter<{ path: string; query?: string; pathParameters?: string }>
	@State() query?: string
	@State() pathParameters?: string
	componentWillLoad() {
		if (window.location.pathname.startsWith(this.path)) {
			this.query = window.location.search.replace("?", "")
			this.pathParameters = window.location.pathname.slice(this.path.length).replace(/^\/+/, "")
			if (this.query || this.pathParameters)
				this.smoothlyUrlUpdate.emit({ query: this.query, path: this.path, pathParameters: this.pathParameters })
		}
	}
	@Listen("smoothlyUrlChange", { target: "window" })
	urlChangeHandler(event: CustomEvent<string>) {
		const url = new URL(event.detail)
		if (url.pathname.startsWith(this.path)) {
			this.query = url.search.replace("?", "")
			this.pathParameters = window.location.pathname.slice(this.path.length).replace(/^\/+/, "")
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
					onClick={() => this.smoothlyUrlUpdate.emit({ path: this.path, pathParameters: "123" })}>
					Add path parameter
				</smoothly-button>
				<smoothly-button
					color="warning"
					onClick={() => this.smoothlyUrlUpdate.emit({ path: this.path, pathParameters: "" })}>
					Remove path parameter
				</smoothly-button>
				<div>
					<p>
						Path param:
						{typeof this.pathParameters === "string" && this.pathParameters.length > 0
							? this.pathParameters
							: "No path params added"}
					</p>
					<p>
						Query params:{" "}
						{typeof this.query === "string" && this.query.length > 0 ? this.query : "No query params added"}
					</p>
				</div>
			</Host>
		)
	}
}
