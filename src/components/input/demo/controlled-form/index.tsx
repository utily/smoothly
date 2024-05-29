import { Component, h, Host, State, VNode, Watch } from "@stencil/core"
import { SmoothlyFormCustomEvent } from "../../../../components"
import { Data } from "../../../../model"

@Component({
	tag: "smoothly-input-demo-controlled-form",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemoControlledForm {
	@State() name = "Initial name"

	@Watch("name")
	nameChanged(current: string, previous: string): void {
		console.log(`updated name from '${previous}' to '${current}'`)
	}

	async submitHandler(
		event: SmoothlyFormCustomEvent<{ result: (result: boolean) => void; value: Data }>
	): Promise<void> {
		event.stopPropagation()
		console.log("Received event. Processing...")
		if (!(typeof event.detail.value.name == "string")) {
			console.error("Bad input. Resolving false")
			event.detail.result(false)
		} else {
			await new Promise(resolve => window.setTimeout(resolve, 1_000))
			this.name = event.detail.value.name
			console.log("Finished processing successfully. Resolving true")
			event.detail.result(true)
		}
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-form readonly looks={"line"} onSmoothlyFormSubmit={e => this.submitHandler(e)}>
					<smoothly-input type={"text"} name={"name"} value={this.name}>
						Name
					</smoothly-input>
					<smoothly-input-edit slot={"edit"} type={"button"} size={"icon"} color={"primary"} fill={"default"} />
					<smoothly-input-reset slot={"reset"} type={"form"} size={"icon"} color={"warning"} fill={"default"} />
					<smoothly-input-submit slot={"submit"} size={"icon"} color={"success"} />
				</smoothly-form>
			</Host>
		)
	}
}
