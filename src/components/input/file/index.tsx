import { Component, Event, EventEmitter, h, Host, Method, Prop, State } from "@stencil/core"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"

@Component({
	tag: "smoothly-input-file",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputFile implements Clearable, Editable {
	private transfer: DataTransfer = new DataTransfer()
	private input?: HTMLInputElement
	@State() dragging = false
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) value?: File
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@Prop({ mutable: true }) readonly?: boolean
	@Event() smoothlyInput: EventEmitter<Record<string, File | undefined>>
	@Event() smoothlyChange: EventEmitter<Record<string, File>>
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Method()
	async setReadonly(readonly: boolean): Promise<void> {
		this.readonly = readonly
	}
	componentWillLoad() {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	private handleClick(event: Event) {
		event.stopPropagation()
		if (!this.readonly)
			this.input?.click()
	}
	render() {
		return (
			<Host
				class={{ dragging: this.dragging }}
				onDragOver={(event: Event) => (event.preventDefault(), event.stopPropagation())}
				onDragEnter={() => {
					if (!this.readonly)
						this.dragging = true
				}}>
				<label>
					<slot name={"label"} />
				</label>
				<smoothly-button disabled={this.readonly} size="flexible" onClick={event => this.handleClick(event)}>
					<slot name={"button"} />
				</smoothly-button>
				<span onClick={event => this.handleClick(event)}>{this.value?.name ?? this.placeholder}</span>
				{!this.readonly && (
					<div
						class={"mask"}
						onDrop={event => (
							event.preventDefault(),
							event.stopPropagation(),
							(this.dragging = false),
							event.dataTransfer?.files.length &&
								(this.smoothlyInput.emit({ [this.name]: (this.value = event.dataTransfer.files[0]) }),
								this.smoothlyChange.emit({ [this.name]: (this.value = event.dataTransfer.files[0]) }))
						)}
						onDragLeave={event => (event.stopPropagation(), (this.dragging = false))}
					/>
				)}
				<input
					readOnly={this.readonly}
					ref={element => (this.input = element)}
					type={"file"}
					files={(this.transfer.items.clear(), this.value && this.transfer.items.add(this.value), this.transfer.files)}
					onInput={event => (
						event.stopPropagation(),
						this.input?.files?.length && this.smoothlyInput.emit({ [this.name]: (this.value = this.input?.files[0]) })
					)}
					onChange={event => (
						event.stopPropagation(),
						this.input?.files?.length && this.smoothlyChange.emit({ [this.name]: (this.value = this.input?.files[0]) })
					)}
				/>
				<slot />
			</Host>
		)
	}
}
