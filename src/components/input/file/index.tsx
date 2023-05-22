import { Component, Event, EventEmitter, h, Host, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-input-file",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputFile {
	private transfer: DataTransfer = new DataTransfer()
	private input?: HTMLInputElement
	@State() dragging = false
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) value?: File
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@Prop({ reflect: true }) readonly = false
	@Event() smoothlyInput: EventEmitter<Record<string, File>>
	@Event() smoothlyChange: EventEmitter<Record<string, File>>

	dropHandler(event: DragEvent) {
		event.preventDefault()
		event.stopPropagation()
		this.dragging = false
		if (!this.readonly && event.dataTransfer?.files.length) {
			this.smoothlyInput.emit({ [this.name]: (this.value = event.dataTransfer.files[0]) })
			this.smoothlyChange.emit({ [this.name]: (this.value = event.dataTransfer.files[0]) })
		}
	}
	dragLeaveHandler(event: DragEvent) {
		event.stopPropagation()
		this.dragging = false
	}
	inputHandler(event: Event) {
		event.stopPropagation()
		if (this.input?.files?.length)
			this.smoothlyInput.emit({ [this.name]: (this.value = this.input?.files[0]) })
	}
	changeHandler(event: Event) {
		event.stopPropagation()
		if (this.input?.files?.length)
			this.smoothlyChange.emit({ [this.name]: (this.value = this.input?.files[0]) })
	}
	clickHandler(event: MouseEvent) {
		event.stopPropagation()
		if (!this.readonly)
			this.input?.click()
	}
	render() {
		return (
			<Host
				class={{ dragging: this.dragging }}
				onDragOver={(e: Event) => (e.preventDefault(), e.stopPropagation())}
				onDragEnter={() => (this.dragging = true)}>
				<label>
					<slot name={"label"} />
				</label>
				<div class="input">
					<smoothly-button size="flexible" onClick={e => this.clickHandler(e)}>
						<slot name={"button"} />
					</smoothly-button>
					<span onClick={e => this.clickHandler(e)}>{this.value?.name ?? this.placeholder}</span>
					<div class={"mask"} onDrop={e => this.dropHandler(e)} onDragLeave={e => this.dragLeaveHandler(e)} />
					<input
						readonly={this.readonly}
						ref={element => (this.input = element)}
						type={"file"}
						files={
							(this.transfer.items.clear(), this.value && this.transfer.items.add(this.value), this.transfer.files)
						}
						onInput={e => this.inputHandler(e)}
						onChange={e => this.changeHandler(e)}
					/>
				</div>
				<slot />
			</Host>
		)
	}
}
