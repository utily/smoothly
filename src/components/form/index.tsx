import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { http } from "cloudly-http"
import { Color } from "../../model"
import { Data } from "../../model/Data"
import { Notice } from "../../model/Notice"
import { Changeable } from "../input/Changeable"
import { Clearable } from "../input/Clearable"
import { Input } from "../input/Input"
import { Looks } from "../input/Looks"
import { Submittable } from "../input/Submittable"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm implements Changeable, Clearable, Submittable {
	private inputs = new Map<string, (Clearable & Input) | Input>()
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ mutable: true }) value: Readonly<Data> = {}
	@Prop({ reflect: true, attribute: "looks" }) looks: Looks = "plain"
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
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks, color: Color | undefined) => void>) {
		event.stopPropagation()
		event.detail(this.looks, this.color)
	}
	@Listen("smoothlyInput")
	async smoothlyInputHandler(event: CustomEvent<Record<string, any>>): Promise<void> {
		this.notice = undefined
		this.smoothlyFormInput.emit((this.value = Data.merge(this.value, event.detail)))
	}
	@Listen("smoothlySubmit")
	async smoothlySubmitHandler(event: CustomEvent): Promise<void> {
		this.processing = true
		await this.submit()
		this.processing = false
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyForm) => void>): Promise<void> {
		event.stopPropagation()
		event.detail(this)
		if (Input.is(event.target)) {
			this.value = Data.merge(this.value, { [event.target.name]: event.target.value })
			this.inputs.set(event.target.name, event.target)
		}
	}
	@Method()
	async submit(): Promise<void> {
		this.smoothlyFormSubmit.emit(this.value)
		this.notice = Notice.execute("Submitting form", async () => {
			let result: [boolean, string] = [false, "No action available"]
			const response = !this.action
				? undefined
				: await http
						.fetch(
							this.method == "POST"
								? http.Request.create({
										method: "POST",
										url: this.action,
										header: { contentType: "application/json" },
										body: this.value,
								  })
								: { url: `${this.action}?${http.Search.stringify(this.value)}` }
						)
						.catch(() => undefined)
			console.log(
				"!response || response?.status < 200 || response.status >= 300: ",
				!response || response?.status < 200 || response.status >= 300
			)
			if (!response || response?.status < 200 || response.status >= 300)
				result = [false, "Failed to submit form."]
			else {
				result = [true, "Form successfully submitted."]
				await this.clear()
			}
			return result
		})
	}
	@Method()
	async clear(): Promise<void> {
		console.log(this.inputs)
		this.inputs.forEach(input => {
			console.log("clear")
			Clearable.is(input) && input.clear()
		})
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
