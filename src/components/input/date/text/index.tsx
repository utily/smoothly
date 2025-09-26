import { Component, Event, EventEmitter, Fragment, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { DateFormat } from "./DateFormat"
import { InputSelection } from "./InputSelection"

/* 
 The regular input is not suitable for displaying a date range in text mode,
 So we create a custom component for that specific purpose.
 For now it will simply display the value as text and not be editable.
 TODO: Make it editable by splitting the value into two inputs, one for for all necessary combinations of year, month, day.
*/

@Component({
	tag: "smoothly-input-date-text",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputDateRangeText {
	private partElements: { [partIndex in number]: HTMLSpanElement | undefined } = {
		0: undefined,
		1: undefined,
		2: undefined,
	}
	@Prop() value?: string
	@Prop() locale: isoly.Locale = "en-GB" // "en-US" // "se-SE" //navigator.language as isoly.Locale
	@Prop({ reflect: true }) readonly: boolean
	@Prop({ reflect: true }) disabled: boolean
	@Prop({ reflect: true }) invalid: boolean
	@Prop({ reflect: true }) placeholder: string
	@Prop({ reflect: true }) showLabel = true
	@Prop({ reflect: true }) name: string
	@State() parts: DateFormat.Parts = {}
	@State() order: DateFormat.Order
	@State() separator: DateFormat.Separator
	@State() focusedIndex?: number
	@Event() smoothlyInput: EventEmitter<{ [name: string]: string | undefined }>

	componentWillLoad() {
		this.order = DateFormat.Order.fromLocale(this.locale)
		this.separator = DateFormat.Separator.fromLocale(this.locale)
		this.value && this.smoothlyInput.emit({ [this.name]: this.value })
	}

	@Watch("parts")
	partsHandler() {
		const value = DateFormat.Parts.toValue(this.parts)
		console.log("value set by parts:", value)
		if (value !== this.value) {
			this.value = value
		}
		this.smoothlyInput.emit({ [this.name]: value })
	}
	@Watch("value")
	valueHandler(newValue: string | undefined) {
		this.smoothlyInput.emit({ [this.name]: newValue })
		console.log("newValue:", newValue)
		if (newValue !== DateFormat.Parts.toValue(this.parts)) {
			if (newValue) {
				const yearIndex = this.order.indexOf("Y")
				const monthIndex = this.order.indexOf("M")
				const dayIndex = this.order.indexOf("D")
				const newParts = DateFormat.Parts.fromValue(newValue)
				this.partElements[yearIndex] && (this.partElements[yearIndex]!.innerText = newParts.Y)
				this.partElements[monthIndex] && (this.partElements[monthIndex]!.innerText = newParts.M)
				this.partElements[dayIndex] && (this.partElements[dayIndex]!.innerText = newParts.D)
				this.parts = { ...newParts }
			} else {
				this.partElements[0] && (this.partElements[0]!.innerText = "")
				this.partElements[1] && (this.partElements[1]!.innerText = "")
				this.partElements[2] && (this.partElements[2]!.innerText = "")
				this.parts = {}
			}
		}
	}

	@Method()
	async select() {
		InputSelection.selectAll(this.partElements[0])
	}

	@Listen("beforeinput", { capture: true })
	beforeInputHandler(e: InputEvent) {
		// e.preventDefault()
		const part = this.order[this.focusedIndex ?? 0] as "Y" | "M" | "D"
		const index = this.focusedIndex ?? 0
		const value = (e.target as HTMLSpanElement).innerText.replace(/\n/g, "").replace(/\D/g, "")
		console.log("beforeInputHandler", e.inputType, index, part, value, this.parts)

		// if (value.length >= ghost[part].length) {
		// 	InputSelection.selectAll(this.partElements[index + 1])
		// }
	}
	@Listen("input", { capture: true })
	inputHandler(e: InputEvent) {
		// e.preventDefault()
		const part = this.order[this.focusedIndex ?? 0] as "Y" | "M" | "D"
		const index = this.focusedIndex ?? 0
		const value = (e.target as HTMLSpanElement).innerText.replace(/\n/g, "").replace(/\D/g, "")
		console.log("inputHandler", e.inputType, index, part, value, this.parts)
		this.parts = {
			...this.parts,
			[part]: value,
		}
		if (value.length >= DateFormat.Part.length(part)) {
			if (part == "D" && parseInt(value) > 28) {
				const maxDay = DateFormat.Parts.maxDay(this.parts)
				if (parseInt(value) > maxDay) {
					this.parts = {
						...this.parts,
						D: maxDay.toString().padStart(2, "0"),
					}
					this.partElements[index] && (this.partElements[index]!.innerText = maxDay.toString().padStart(2, "0"))
					// InputSelection.selectAll(this.partElements[Math.min(index + 1, 2)])
					InputSelection.setPosition(this.partElements[index], 2)
				}
			} else if ((part == "M" && parseInt(value) > 12) || (value.length == 1 && parseInt(value) > 1)) {
				const monthString = Math.min(parseInt(value), 12).toString().padStart(2, "0")
				this.parts = {
					...this.parts,
					M: monthString,
				}
				this.partElements[index] && (this.partElements[index]!.innerText = monthString)
			} else if (part == "Y" && parseInt(value) > 9999) {
				InputSelection.selectAll(this.partElements[index + 1])
			}
			InputSelection.selectAll(this.partElements[index + 1])
		}
	}

	render() {
		return (
			<Host
				class={{
					"has-text": Object.values(this.parts).some(part => !!part),
					"has-value": !!this.value,
				}}>
				<slot name="start" />
				<label class={"label float-on-focus"}>
					<slot />
				</label>
				<div
					class={{
						"smoothly-date-text-value": true,
					}}>
					{[...this.order].map((part: "Y" | "M" | "D", index: number) => (
						<Fragment>
							<span
								class={{
									"smoothly-date-text-part": true,
									[`smoothly-date-text-${part}`]: true,
									focused: this.focusedIndex === index,
									"filled-part": (this.parts[part]?.length ?? 0) >= DateFormat.Part.length(part),
								}}
								onFocus={() => (this.focusedIndex = index)}
								onBlur={() => (this.focusedIndex = undefined)}
								onInput={e => {
									// e.preventDefault()
									// const value = (e.target as HTMLSpanElement).innerText.replace(/\n/g, "").replace(/\D/g, "")
									// this.parts = {
									// 	...this.parts,
									// 	[part]: value,
									// }
									// if (value.length >= ghost[part].length) {
									// 	InputSelection.selectAll(this.partElements[index + 1])
									// }
								}}
								onKeyDown={e => {
									const text = (e.target as HTMLSpanElement).innerText.replace(/\n/g, "").replace(/\D/g, "")
									if (InputSelection.isAtStart(e) && e.key == "ArrowLeft") {
										InputSelection.selectAll(this.partElements[index - 1])
										e.preventDefault() // Keep selection
									} else if (InputSelection.isAtEnd(e) && e.key == "ArrowRight") {
										InputSelection.selectAll(this.partElements[index + 1])
										e.preventDefault() // Keep selection
									} else if (e.key == "Home" || e.key == "ArrowUp") {
										InputSelection.selectAll(this.partElements[0])
										e.preventDefault() // Keep selection
									} else if (e.key == "End" || e.key == "ArrowDown") {
										InputSelection.selectAll(this.partElements[2])
										e.preventDefault() // Keep selection
									} else if (InputSelection.isAtStart(e) && e.key == "Backspace" && text == "") {
										InputSelection.selectAll(this.partElements[index - 1])
										e.preventDefault() // Prevent delete previous part
									} else if (InputSelection.isAtEnd(e) && e.key == "Delete" && text == "") {
										InputSelection.selectAll(this.partElements[index + 1])
										e.preventDefault() // Prevent delete next part
									}
								}}
								key={index}
								ref={el => (this.partElements[index] = el)}
								contenteditable={!(this.readonly || this.disabled)}>
								{/* year or month or day written here */}
							</span>
							<span class="ghost">{DateFormat.Part.getGuide(part, this.parts[part]?.length)}</span>
							{index < this.order.length - 1 && <span class="separator">{this.separator}</span>}
						</Fragment>
					))}
				</div>
				<slot name="end" />
			</Host>
		)
	}
}
