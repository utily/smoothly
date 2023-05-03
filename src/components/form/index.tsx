import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State } from "@stencil/core"
import { http } from "cloudly-http"
import { Clearable } from "../../model/Clearable"
import { Data } from "../../model/Data"
import { Notice } from "../../model/Notice"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm {
	private value: Data = {}
	private clearables = new Map<string, Clearable>()
	@Prop({ reflect: true, attribute: "looks" }) looks: "plain" | "grid" | "border" | "line" = "plain"
	@Prop() name?: string
	@Prop() method?: "GET" | "POST"
	@Prop() action?: string
	@Prop({ mutable: true, reflect: true }) processing: boolean
	@Prop() prevent = true
	@Event() smoothlyFormInput: EventEmitter<Data>
	@Event() smoothlyFormSubmit: EventEmitter<Data>
	@State() notice?: Notice

	@Listen("smoothlyInput")
	async smoothlyInputHandler(event: CustomEvent<Record<string, any>>): Promise<void> {
		this.notice = undefined
		this.smoothlyFormInput.emit(
			(this.value = Object.entries(event.detail).reduce(
				(r, [name, value]) => Data.set(r, name.split("."), value),
				this.value
			))
		)
		if (Clearable.is(event.target)) {
			const clearable = event.target
			Object.keys(event.detail).forEach(key => this.clearables.set(key, clearable))
		}
	}
	@Listen("smoothlySubmit")
	async smoothlySubmitHandler(event: CustomEvent): Promise<void> {
		this.processing = true
		this.submit()
		this.processing = false
	}
	@Method()
	async submit(): Promise<void> {
		this.smoothlyFormSubmit.emit(this.value)
		if (this.action) {
			const response = await http.fetch(
				this.method == "POST"
					? { method: "POST", url: this.action, body: this.value }
					: { url: `${this.action}?${http.Search.stringify(this.value)}` }
			)
			if (response.status >= 200 && response.status < 300) {
				this.notice = Notice.succeded("Form sucessfully submitted.")
				await this.clear()
			} else this.notice = Notice.failed("Failed to submit form.")
		}
	}
	@Method()
	async clear(): Promise<void> {
		new Set(this.clearables.values()).forEach(clearable => clearable.clear())
	}
	render() {
		return (
			<Host>
				{this.notice ? <smoothly-notification notice={this.notice}></smoothly-notification> : []}
				<smoothly-spinner active={this.processing}></smoothly-spinner>
				<form onSubmit={!this.prevent ? undefined : e => e.preventDefault()} name={this.name}>
					<fieldset>
						<slot></slot>
					</fieldset>
					<slot name="submit"></slot>
				</form>
			</Host>
		)
	}
}
