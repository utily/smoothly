import { Component, Event, EventEmitter, h } from "@stencil/core"
import { Notice } from "../../../model"

@Component({
	tag: "smoothly-notifier-demo",
})
export class SmoothlyNotifierDemo {
	@Event() notice: EventEmitter<Notice>

	private task(succeed: boolean, ms = 2000): Notice.Task {
		return () =>
			new Promise<[boolean, string]>(resolve =>
				window.setTimeout(() => resolve(succeed ? [true, "Task completed."] : [false, "Task failed."]), ms)
			)
	}

	render() {
		return (
			<main>
				<fieldset>
					<h2>Immediate</h2>
					<p>Fires right away and closes after the default 15 seconds.</p>
					<smoothly-button
						color="success"
						fill="solid"
						onClick={() => this.notice.emit(Notice.succeeded("Payment processed successfully."))}>
						Success
					</smoothly-button>
					<smoothly-button
						color="danger"
						fill="solid"
						onClick={() => this.notice.emit(Notice.failed("Payment could not be processed."))}>
						Failed
					</smoothly-button>
					<smoothly-button
						color="warning"
						fill="solid"
						onClick={() => this.notice.emit(Notice.warn("Balance is running low."))}>
						Warning
					</smoothly-button>
				</fieldset>
				<fieldset>
					<h2>Task</h2>
					<p>Shows an executing spinner while the task runs, then transitions to success or failure.</p>
					<smoothly-button
						color="success"
						fill="outline"
						onClick={() => this.notice.emit(Notice.execute("Processing payment…", this.task(true)))}>
						Execute (succeeds after 2s)
					</smoothly-button>
					<smoothly-button
						color="danger"
						fill="outline"
						onClick={() => this.notice.emit(Notice.execute("Processing payment…", this.task(false)))}>
						Execute (fails after 2s)
					</smoothly-button>
					<smoothly-button
						color="medium"
						fill="solid"
						onClick={() => this.notice.emit(Notice.delay("Payment scheduled…", this.task(true)))}>
						Delay (waits 5s, then executes)
					</smoothly-button>
				</fieldset>
				<fieldset>
					<h2>Custom lifetime</h2>
					<p>Controls how long the notice stays visible after resolving.</p>
					<smoothly-button
						color="success"
						fill="solid"
						onClick={() => this.notice.emit(Notice.succeeded("Gone in 3 seconds.", 3000))}>
						Success (3s)
					</smoothly-button>
					<smoothly-button
						color="warning"
						fill="solid"
						onClick={() => this.notice.emit(Notice.warn("Sticks around for 30 seconds.", 30000))}>
						Warning (30s)
					</smoothly-button>
				</fieldset>
			</main>
		)
	}
}
