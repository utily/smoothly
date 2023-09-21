import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { http } from "cloudly-http"
import { Data } from "../../model/Data"
import { Notice } from "../../model/Notice"
import { Changeable } from "../input/Changeable"
import { Clearable } from "../input/Clearable"
import { Looks } from "../input/Looks"
import { Submittable } from "../input/Submittable"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm implements Changeable, Clearable, Submittable {
	private clearables = new Map<string, Clearable>()
	@Prop({ mutable: true }) value: Readonly<Data> = {}
	@Prop({ reflect: true, attribute: "looks" }) looks: "plain" | "grid" | "border" | "line" = "plain"
	@Prop() name?: string
	@Prop() method?: "GET" | "POST"
	@Prop() action?: string
	@Prop({ mutable: true, reflect: true }) processing: boolean
	@Prop() prevent = true
	@Event() smoothlyFormInput: EventEmitter<Data>
	@Event() smoothlyFormSubmit: EventEmitter<Data>
	@State() notice?: Notice
	@Prop({ mutable: true, reflect: true }) changed = false
	private listeners: { changed?: ((parent: Changeable) => Promise<void>)[] } = {}

	listen(property: "changed", listener: (parent: Changeable) => Promise<void>): void {
		;(this.listeners[property] ??= []).push(listener)
		listener(this)
	}
	@Watch("value")
	watchValue() {
		this.changed = Object.values(this.value).filter(value => Boolean(value)).length > 0
		this.listeners.changed?.forEach(l => l(this))
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>) {
		event.stopPropagation()
		event.detail(this.looks)
	}
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
	@Listen("smoothlyInputLoad")
	async SmoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyForm) => void>): Promise<void> {
		event.detail(this)
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
				this.notice = Notice.succeeded("Form sucessfully submitted.")
				await this.clear()
			} else
				this.notice = Notice.failed("Failed to submit form.")
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
					<div>
						<slot name="clear"></slot>
						<slot name="submit"></slot>
					</div>
				</form>
			</Host>
		)
	}
}
