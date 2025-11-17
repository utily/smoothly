import { Component, h, Host, Listen, Method, Prop } from "@stencil/core"

type InputEventWrapper = {
	preventDefault: () => void
	setValue: (value: string) => void
	value: string
	selection: {
		start: number | null
		end: number | null
		isCollapsed: boolean | null
	}
	inputType: string
	data: string | null
}

type KeydownEventWrapper = {
	preventDefault: () => void
	value: string
	key: string
	code: string
	altKey: boolean
	ctrlKey: boolean
	shiftKey: boolean
	metaKey: boolean
	cursor: {
		atStart: boolean
		atEnd: boolean
	}
}

/*
	This component is a text input that resizes smoothly based on its content.
	It uses a hidden mirror span to measure the width of the content and adjust
	the input width accordingly.
*/

@Component({
	tag: "smoothly-text-editable",
	scoped: true,
})
export class SmoothlyTextEditable {
	private mirrorElement: HTMLSpanElement | undefined
	private inputElement: HTMLInputElement | undefined
	@Prop() readonly: boolean = false
	@Prop() inputMode: "text" | "numeric" = "text"
	@Prop() onBeforeInput?: (e: InputEventWrapper) => void
	@Prop() onInput?: (e: InputEventWrapper) => void
	@Prop() onFocus?: () => void
	@Prop() onBlur?: () => void
	@Prop() onKeyDown?: (e: KeydownEventWrapper) => void

	@Method()
	async setInputValue(value: string) {
		this.set(value)
	}
	@Method()
	async setCursorPosition(position: number) {
		this.inputElement?.focus()
		this.inputElement?.setSelectionRange(position, position)
	}

	@Method()
	async selectAll() {
		const valueLength = this.inputElement?.value.length || 0
		this.inputElement?.focus()
		this.inputElement?.setSelectionRange(0, valueLength)
	}

	set(value: string) {
		this.inputElement!.value = value
		this.mirrorElement!.textContent = this.inputElement?.value || "\u200b"
		this.inputElement!.style.width = this.mirrorElement!.offsetWidth + "px"
	}

	@Listen("beforeinput")
	beforeInputHandler(e: InputEvent) {
		e.stopPropagation()
		if (this.onBeforeInput) {
			const wrapper: InputEventWrapper = {
				preventDefault: () => e.preventDefault(),
				setValue: (value: string) => this.set(value),
				value: this.inputElement!.value,
				selection: {
					start: this.inputElement!.selectionStart,
					end: this.inputElement!.selectionEnd,
					isCollapsed:
						this.inputElement!.selectionStart !== null &&
						this.inputElement!.selectionEnd !== null &&
						this.inputElement!.selectionStart === this.inputElement!.selectionEnd,
				},
				inputType: e.inputType,
				data: e.data,
			}
			this.onBeforeInput(wrapper)
		}
	}

	@Listen("input")
	inputHandler(e: InputEvent) {
		e.stopPropagation()
		if (this.onInput) {
			const wrapper: InputEventWrapper = {
				preventDefault: () => e.preventDefault(),
				setValue: (value: string) => this.set(value),
				value: this.inputElement?.value || "",
				selection: {
					start: this.inputElement!.selectionStart,
					end: this.inputElement!.selectionEnd,
					isCollapsed:
						this.inputElement!.selectionStart !== null &&
						this.inputElement!.selectionEnd !== null &&
						this.inputElement!.selectionStart === this.inputElement!.selectionEnd,
				},
				inputType: e.inputType,
				data: e.data,
			}
			this.onInput(wrapper)
		}
	}

	@Listen("keydown")
	keydownHandler(e: KeyboardEvent) {
		if (this.onKeyDown) {
			const wrapper: KeydownEventWrapper = {
				preventDefault: () => e.preventDefault(),
				value: this.inputElement?.value || "",
				key: e.key,
				code: e.code,
				altKey: e.altKey,
				ctrlKey: e.ctrlKey,
				shiftKey: e.shiftKey,
				metaKey: e.metaKey,
				cursor: {
					atStart: this.inputElement?.selectionStart === 0,
					atEnd: this.inputElement?.selectionEnd === this.inputElement?.value.length,
				},
			}
			this.onKeyDown(wrapper)
		}
	}

	render() {
		return (
			<Host>
				<span class="mirror" ref={el => (this.mirrorElement = el)}>
					{/* Used to know how wide the input should be */}
				</span>
				<input
					ref={el => (this.inputElement = el)}
					type="text"
					inputMode={this.inputMode}
					onFocus={() => this.onFocus?.()}
					onBlur={() => this.onBlur?.()}
					readonly={this.readonly}
				/>
			</Host>
		)
	}
}
