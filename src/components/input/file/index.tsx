import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from "@stencil/core"

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
	@Prop({ mutable: true }) value?: File
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyFocus: EventEmitter<void>
	@Event() smoothlyInput: EventEmitter<Record<string, File | undefined>>
	@Event() smoothlyChange: EventEmitter<Record<string, File | undefined>>
	@Event() smoothlyFormInput: EventEmitter<void>

	componentWillLoad() {
		this.smoothlyFormInput.emit()
		this.smoothlyInput.emit({ [this.name]: this.value })

		window.addEventListener("focus", (e: Event) => {
			if (!this.value)
				this.smoothlyBlur.emit()
		})
	}

	@Watch("value")
	onChangeValue(value: File, pre: File | undefined) {
		if (value != pre)
			this.smoothlyChange.emit({ [this.name]: this.value })
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	onClick() {
		this.input?.click()
		this.smoothlyFocus.emit()
	}

	onDrop(event: DragEvent) {
		this.abortEvent(event)
		this.dragging = false
		if (event.dataTransfer?.files.length)
			this.value = event.dataTransfer.files[0]
	}

	onDragEnter() {
		this.dragging = true
		this.smoothlyFocus.emit()
	}

	onDragLeave() {
		this.dragging = false
		this.smoothlyBlur.emit()
	}

	onInput() {
		if (this.input?.files?.length)
			this.value = this.input?.files[0]
	}

	abortEvent(event: Event) {
		event.preventDefault()
		event.stopPropagation()
	}

	render() {
		return (
			<Host
				onDragOver={(event: Event) => this.abortEvent(event)}
				onDragEnter={() => this.onDragEnter()}
				onClick={() => this.onClick()}>
				<span onClick={() => this.onClick()}>{this.value?.name}</span>
				<div
					onDragLeave={() => this.onDragLeave()}
					class={`${this.dragging ? "overlayer" : "hidden"}`}
					onDrop={(event: DragEvent) => this.onDrop(event)}></div>
				<input
					ref={element => (this.input = element)}
					type="file"
					files={(this.transfer.items.clear(), this.value && this.transfer.items.add(this.value), this.transfer.files)}
					onInput={() => this.onInput()}
				/>
			</Host>
		)
	}
}
