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

type DateParts = { [part in "Y" | "M" | "D"]?: string }

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
	@State() parts: DateParts = {}
	@State() order: DateFormat.Order
	@State() separator: DateFormat.Separator
	@State() focusedIndex?: number
	@Event() smoothlyInput: EventEmitter<{ [name: string]: string | undefined }>

	componentWillLoad() {
		this.order = DateFormat.Order.fromLocale(this.locale)
		this.separator = DateFormat.Separator.fromLocale(this.locale)
		this.value && this.smoothlyInput.emit({ [this.name]: this.value })
	}

	getMaxDay() {
		if (this.parts.Y && this.parts.M && parseInt(this.parts.M) <= 12) {
			const lastDate = isoly.Date.lastOfMonth(`${this.parts.Y.padStart(4, "0")}-${this.parts.M.padStart(2, "0")}-01`)
			return isoly.Date.getDay(lastDate)
		} else if (this.parts.M && parseInt(this.parts.M) <= 12) {
			// Assume leap year
			const lastDate = isoly.Date.lastOfMonth(`2004-${this.parts.M.padStart(2, "0")}-01`)
			return isoly.Date.getDay(lastDate)
		}
		return 31
	}

	partsToValue(): string | undefined {
		const year = this.parts.Y && this.parts.Y.length == 4 ? this.parts.Y.padStart(4, "0") : undefined
		const month =
			this.parts.M && this.parts.M.length >= 1 && parseInt(this.parts.M) >= 1 && parseInt(this.parts.M) <= 12
				? (this.parts.M.length == 1 ? "0" : "") + parseInt(this.parts.M).toString().padStart(2, "0")
				: undefined
		const day =
			this.parts.D &&
			this.parts.D.length >= 1 &&
			parseInt(this.parts.D) >= 1 &&
			parseInt(this.parts.D) <= this.getMaxDay()
				? (this.parts.D.length == 1 ? "0" : "") + parseInt(this.parts.D).toString().padStart(2, "0")
				: undefined
		return year && month && day ? `${year}-${month}-${day}` : undefined
	}
	valueToParts(value: string | undefined): DateParts | undefined {
		if (value) {
			const year = value.substring(0, 4).padStart(4, "0")
			const month = value.substring(5, 7).padStart(2, "0")
			const day = value.substring(8, 10).padStart(2, "0")
			return {
				Y: year,
				M: month,
				D: day,
			}
		}
		return undefined
	}

	@Watch("parts")
	partsHandler() {
		const value = this.partsToValue()
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
		if (newValue !== this.partsToValue()) {
			if (newValue) {
				const yearIndex = this.order.indexOf("Y")
				const monthIndex = this.order.indexOf("M")
				const dayIndex = this.order.indexOf("D")
				const newParts = this.valueToParts(newValue)
				this.partElements[yearIndex] && (this.partElements[yearIndex]!.innerText = newParts?.Y ?? "")
				this.partElements[monthIndex] && (this.partElements[monthIndex]!.innerText = newParts?.M ?? "")
				this.partElements[dayIndex] && (this.partElements[dayIndex]!.innerText = newParts?.D ?? "")
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
		if (value.length >= ghost[part].length) {
			if (part == "D" && parseInt(value) > 28) {
				const maxDay = this.getMaxDay()
				if (parseInt(value) > maxDay) {
					this.parts = {
						...this.parts,
						D: maxDay.toString().padStart(2, "0"),
					}
					this.partElements[index] && (this.partElements[index]!.innerText = maxDay.toString().padStart(2, "0"))
					// InputSelection.selectAll(this.partElements[Math.min(index + 1, 2)])
					InputSelection.setPosition(this.partElements[index], 2)
				}
			} else if (part == "M" && parseInt(value) > 12) {
				// TODO
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
									"filled-part": (this.parts[part]?.length ?? 0) >= ghost[part].length,
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
							<span class="ghost">
								{ghost[part].substring(0, ghost[part].length - (this.parts[part]?.length ?? 0))}
							</span>
							{index < this.order.length - 1 && <span class="separator">{this.separator}</span>}
						</Fragment>
					))}
				</div>
				<slot name="end" />
			</Host>
		)
	}
}

const ghost = {
	["Y"]: "YYYY",
	["M"]: "MM",
	["D"]: "DD",
} as const
