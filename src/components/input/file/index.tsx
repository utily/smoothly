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
	@Prop({ mutable: true }) value?: File
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@Event() smoothlyInput: EventEmitter<Record<string, File>>
	@Event() smoothlyChange: EventEmitter<Record<string, File>>
	render() {
		return (
			<Host
				class={{ dragging: this.dragging }}
				onDragOver={(event: Event) => (event.preventDefault(), event.stopPropagation())}
				onDragEnter={() => (this.dragging = true)}
				onClick={(event: Event) => (event.stopPropagation(), this.input?.click())}
				onDrop={(event: DragEvent) => (
					event.preventDefault(),
					event.stopPropagation(),
					(this.dragging = false),
					event.dataTransfer?.files.length &&
						(this.smoothlyInput.emit({ [this.name]: (this.value = event.dataTransfer.files[0]) }),
						this.smoothlyChange.emit({ [this.name]: (this.value = event.dataTransfer.files[0]) }))
				)}
				onDragLeave={(event: DragEvent) => (event.stopPropagation(), (this.dragging = false))}>
				<div onClick={event => (event.stopPropagation(), this.input?.click())}>{this.value?.name}</div>
				<input
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
			</Host>
		)
	}
}
