import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, Watch } from "@stencil/core"
import { http } from "cloudly-http"
import { Color, Data, Notice } from "../../model"
import { Changeable } from "../input/Changeable"
import { Clearable } from "../input/Clearable"
import { Editable } from "../input/Editable"
import { Input } from "../input/Input"
import { Looks } from "../input/Looks"
import { Submittable } from "../input/Submittable"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm implements Changeable, Clearable, Submittable, Editable {
	private inputs = new Map<string, Input.Element>()
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ mutable: true }) value: Readonly<Data> = {}
	@Prop({ mutable: true, reflect: true }) readonly = false
	@Prop({ reflect: true, attribute: "looks" }) looks: Looks = "plain"
	@Prop() name?: string
	@Prop() method?: "GET" | "POST"
	@Prop() action?: string
	@Prop({ mutable: true, reflect: true }) processing: boolean
	@Prop() prevent = true
	@Event() smoothlyFormInput: EventEmitter<Data>
	@Event() smoothlyFormSubmit: EventEmitter<Data>
	@Event() notice: EventEmitter<Notice>

	@Prop({ mutable: true, reflect: true }) changed = false
	private listeners: {
		changed?: ((parent: Changeable) => Promise<void>)[]
		readonly?: ((parent: Editable) => Promise<void>)[]
	} = {}

	listen(property: "changed", listener: (parent: Changeable) => Promise<void>): void {
		;(this.listeners[property] ??= []).push(listener)
		listener(this)
	}
	listenReadonly(property: "readonly", listener: (parent: Editable) => Promise<void>): void {
		;(this.listeners[property] ??= []).push(listener)
		listener(this)
	}
	@Watch("value")
	watchValue() {
		this.changed = Object.values(this.value).filter(value => Boolean(value)).length > 0
		this.listeners.changed?.forEach(l => l(this))
	}
	@Watch("readonly")
	watchReadonly() {
		this.listeners.readonly?.forEach(l => l(this))
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks, color: Color | undefined) => void>) {
		event.stopPropagation()
		event.detail(this.looks, this.color)
	}
	@Listen("smoothlyInput")
	async smoothlyInputHandler(event: CustomEvent<Record<string, any>>): Promise<void> {
		this.smoothlyFormInput.emit((this.value = Data.merge(this.value, event.detail)))
	}
	@Listen("smoothlySubmit")
	async smoothlySubmitHandler(event: CustomEvent): Promise<void> {
		this.processing = true
		await this.submit()
		this.processing = false
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent): Promise<void> {
		event.stopPropagation()
		event.detail(this)
		if (Input.Element.is(event.target)) {
			this.value = Data.merge(this.value, { [event.target.name]: event.target.value })
			this.inputs.set(event.target.name, event.target)
		}
	}
	@Listen("smoothlyFormDisable")
	async smoothlyFormDisableHandler(event: CustomEvent): Promise<void> {
		event.stopPropagation()
		event.detail(this.readonly)
	}
	@Method()
	async submit(): Promise<void> {
		this.smoothlyFormSubmit.emit(this.value)
		if (this.action) {
			const action = this.action
			this.notice?.emit(
				Notice.execute("Submitting form", async () => {
					const response = await http
						.fetch(
							this.method == "POST"
								? http.Request.create({
										method: "POST",
										url: action,
										header: { contentType: "application/json" },
										body: this.value,
								  })
								: { url: `${action}?${http.Search.stringify(this.value)}` }
						)
						.catch(() => undefined)
					let result: [boolean, string]
					if (!response || response?.status < 200 || response.status >= 300)
						result = [false, "Failed to submit form."]
					else {
						result = [true, "Form successfully submitted."]
						this.clear()
					}
					return result
				})
			)
		}
	}
	@Method()
	async clear(): Promise<void> {
		this.inputs.forEach(input => {
			Clearable.is(input) && input.clear()
		})
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.inputs.forEach(input => {
			Editable.type.is(input) && input.edit(editable)
		})
		this.readonly = !editable
	}
	render() {
		return (
			<Host>
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
