import { Component, Event, EventEmitter, Fragment, h, Host, Listen, Method, Prop } from "@stencil/core"
import { Date } from "isoly"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"

@Component({
	tag: "smoothly-input-date",
	styleUrl: "style.css",
	scoped: true,
})
export class InputDate implements Clearable, Editable {
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ mutable: true }) value?: Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ mutable: true }) disabled: boolean
	@Event() smoothlyFormInputLoad: EventEmitter<void>
	@Event() smoothlyInputReadOnly: EventEmitter<void>
	private input?: HTMLSmoothlyInputElement
	componentWillLoad() {
		this.smoothlyFormInputLoad.emit()
	}

	@Listen("dateSet")
	dateSetHandler(e: CustomEvent<Date>) {
		this.open = false
		e.stopPropagation()
	}

	@Method()
	async clear(): Promise<void> {
		this.input?.clear()
	}
	@Method()
	async setReadonly(readonly: boolean): Promise<void> {
		this.readonly = readonly
		this.smoothlyInputReadOnly.emit()
	}

	render() {
		return (
			<Host>
				<smoothly-input
					ref={e => (this.input = e)}
					readonly
					name={this.name}
					onFocus={() => (this.open = true)}
					onClick={() => (this.open = true)}
					disabled={this.disabled}
					type="date"
					value={this.value}
					onSmoothlyInput={e => (this.value = e.detail[this.name] ? e.detail[this.name] : undefined)}
					onSmoothlyChange={e => {
						e.stopPropagation()
						e.preventDefault()
					}}
				/>
				{this.open && !this.disabled && !this.readonly && (
					<Fragment>
						<div class="overlayer" onClick={() => (this.open = false)}></div>
						<div class="container">
							<div class="arrow"></div>
							<smoothly-calendar
								doubleInput={false}
								value={this.value ?? Date.now()}
								onValueChanged={event => {
									this.value = event.detail
									event.stopPropagation()
								}}
								max={this.max}
								min={this.min}></smoothly-calendar>
						</div>
					</Fragment>
				)}
			</Host>
		)
	}
}
