import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { DateFormat } from "./DateFormat"
import { InputSelection } from "./InputSelection"

/* 
 The regular input is not suitable for displaying a date range in text mode,
 So we create a custom component for that specific purpose.
*/

@Component({
	tag: "smoothly-date-text",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputDateRangeText {
	@Element() element: HTMLElement
	private partElements: { [partIndex in number]: HTMLSpanElement | undefined } = {
		0: undefined,
		1: undefined,
		2: undefined,
	}
	@Prop() locale: isoly.Locale = navigator.language as isoly.Locale
	@Prop({ reflect: true }) readonly: boolean
	@Prop({ reflect: true }) disabled: boolean
	@Prop({ reflect: true }) invalid: boolean
	@Prop({ reflect: true }) placeholder: string
	@Prop({ reflect: true }) showLabel = true
	@Prop() value?: isoly.Date // Only used for initial value
	@State() parts: DateFormat.Parts = {}
	private previousEmittedValue?: isoly.Date
	@State() order: DateFormat.Order
	@State() separator: DateFormat.Separator
	@State() focusedIndex?: number
	@Event() smoothlyDateTextChange: EventEmitter<isoly.Date | undefined>
	@Event() smoothlyDateTextFocusChange: EventEmitter<boolean>
	@Event() smoothlyDateTextDone: EventEmitter<void>
	@Event() smoothlyDateTextPrevious: EventEmitter<void>
	@Event() smoothlyDateTextNext: EventEmitter<void>

	componentWillLoad() {
		this.order = DateFormat.Order.fromLocale(this.locale)
		this.separator = DateFormat.Separator.fromLocale(this.locale)
	}
	async componentDidLoad() {
		await this.setValue(this.value)
	}

	@Watch("parts")
	partsHandler() {
		const value = DateFormat.Parts.toDate(this.parts)
		if (value != this.previousEmittedValue) {
			this.smoothlyDateTextChange.emit(value)
			this.previousEmittedValue = value
		}
	}
	@Watch("focusedIndex")
	focusedIndexHandler() {
		this.smoothlyDateTextFocusChange.emit(typeof this.focusedIndex == "number")
	}

	@Method()
	async setValue(value: isoly.Date | undefined) {
		const parts = DateFormat.Parts.fromDate(value)
		this.setAllParts(parts)
	}

	setAllParts(parts?: DateFormat.Parts) {
		this.parts = parts ?? {}
		const yearIndex = this.order.indexOf("Y")
		const monthIndex = this.order.indexOf("M")
		const dayIndex = this.order.indexOf("D")
		this.partElements[yearIndex] && (this.partElements[yearIndex]!.innerText = this.parts.Y ?? "")
		this.partElements[monthIndex] && (this.partElements[monthIndex]!.innerText = this.parts.M ?? "")
		this.partElements[dayIndex] && (this.partElements[dayIndex]!.innerText = this.parts.D ?? "")
	}

	setPart(part: "Y" | "M" | "D", value: string | undefined) {
		this.parts = {
			...this.parts,
			[part]: value,
		}
		const index = this.order.indexOf(part)
		this.partElements[index] && (this.partElements[index]!.innerText = value ?? "")
	}

	@Method()
	async select(place: "start" | "end" = "start") {
		const index = place == "start" ? 0 : 2
		this.setFocus(index)
	}
	@Method()
	async deselect() {
		this.partElements[this.focusedIndex ?? 0]?.blur()
	}

	getInnerText(target: EventTarget | null) {
		return (target as HTMLSpanElement).innerText.replace(/\n/g, "").replace(/\D/g, "")
	}

	@Listen("beforeinput")
	beforeInputHandler(e: InputEvent) {
		const part = this.order[this.focusedIndex ?? 0] as "Y" | "M" | "D"
		const value = this.getInnerText(e.target)
		const nonDigitData = e.data && /\D/.test(e.data)
		const hasMaxLength = value.length >= DateFormat.Part.length(part)
		const noRangedSelection = InputSelection.isCollapsed(e.target as HTMLElement)
		console.log("beforeInput", e.inputType, e.data)
		if (
			(e.inputType == "insertText" || e.inputType == "insertFromPaste") &&
			(nonDigitData || (hasMaxLength && noRangedSelection))
		) {
			e.preventDefault()
		}
		if (e.inputType == "insertParagraph" || e.inputType == "insertLineBreak") {
			this.smoothlyDateTextDone.emit()
			e.preventDefault()
		}
	}

	@Listen("input", { capture: true })
	inputHandler(e: InputEvent) {
		const part = this.order[this.focusedIndex ?? 0] as "Y" | "M" | "D"
		const index = this.focusedIndex ?? 0
		const value = this.getInnerText(e.target)
		this.parts = {
			...this.parts,
			[part]: value,
		}
		if (part == "D") {
			if (value.length >= 2 && parseInt(value) > 28) {
				const maxDay = DateFormat.Parts.maxDay(this.parts)
				if (parseInt(value) > maxDay) {
					this.setPart("D", maxDay.toString().padStart(2, "0"))
					InputSelection.setPosition(this.partElements[index], 2)
				}
			} else if (value.length == 1 && parseInt(value) > 3) {
				const dayString = parseInt(value).toString().padStart(2, "0")
				this.setPart("D", dayString)
				this.setFocus(index + 1)
			}
		} else if (part == "M") {
			if (parseInt(value) > 12) {
				const monthString = "12"
				this.setPart("M", monthString)
				InputSelection.setPosition(this.partElements[index], 2)
			} else if (value.length == 1 && parseInt(value) > 1) {
				const monthString = Math.min(parseInt(value), 12).toString().padStart(2, "0")
				this.setPart("M", monthString)
				this.setFocus(index + 1)
			}
		}
		if (value.length >= DateFormat.Part.length(part)) {
			this.setFocus(index + 1)
		}
		const roundedValue = DateFormat.Parts.toDate(this.parts)
		if (roundedValue) {
			const roundedParts = DateFormat.Parts.fromDate(roundedValue)
			if (this.parts.D !== roundedParts?.D) {
				this.setPart("D", roundedParts?.D)
			}
		}
	}

	completePartIfPossible(index: number) {
		const part = this.order[index] as "Y" | "M" | "D"
		const value = this.parts[part] ?? ""
		if (part == "D" && value.length == 1) {
			if (parseInt(value) > 0) {
				const dayString = Math.min(parseInt(value), DateFormat.Parts.maxDay(this.parts)).toString().padStart(2, "0")
				this.setPart("D", dayString)
			}
		} else if (part == "M" && value.length == 1) {
			const monthString = Math.min(parseInt(value), 12).toString().padStart(2, "0")
			this.setPart("M", monthString)
		}
	}

	setFocus(index: number) {
		console.log("setFocus", index)
		if (index < 0) {
			this.smoothlyDateTextPrevious.emit()
		} else if (index > 2) {
			this.smoothlyDateTextNext.emit()
		} else {
			InputSelection.selectAll(this.partElements[index])
		}
	}

	render() {
		return (
			<Host class={{ "has-text": Object.values(this.parts).some(part => !!part) }}>
				{[...this.order].map((part: "Y" | "M" | "D", index: number) => (
					<span
						onClick={() => {
							if (!this.readonly && !this.disabled)
								this.setFocus(index)
						}}>
						<span
							class={{
								"smoothly-date-text-part": true,
								[`smoothly-date-text-${part}`]: true,
								focused: this.focusedIndex === index,
								"filled-part": (this.parts[part]?.length ?? 0) >= DateFormat.Part.length(part),
							}}
							onFocus={() => (this.focusedIndex = index)}
							onBlur={() => (this.focusedIndex = undefined)}
							onKeyDown={(e: KeyboardEvent) => {
								const text = this.getInnerText(e.target)
								if (InputSelection.isAtStart(e) && e.key == "ArrowLeft") {
									this.completePartIfPossible(index)
									this.setFocus(index - 1)
									e.preventDefault() // Keep selection
								} else if (InputSelection.isAtEnd(e) && e.key == "ArrowRight") {
									this.completePartIfPossible(index)
									this.setFocus(index + 1)
									e.preventDefault() // Keep selection
								} else if (e.key == "Home" || e.key == "ArrowUp") {
									this.completePartIfPossible(index)
									this.setFocus(0)
									e.preventDefault() // Keep selection
								} else if (e.key == "End" || e.key == "ArrowDown") {
									this.completePartIfPossible(index)
									this.setFocus(2)
									e.preventDefault() // Keep selection
								} else if (InputSelection.isAtStart(e) && e.key == "Backspace" && text == "") {
									this.completePartIfPossible(index)
									this.setFocus(index - 1)
									e.preventDefault() // Prevent delete previous part
								} else if (InputSelection.isAtEnd(e) && e.key == "Delete" && text == "") {
									this.completePartIfPossible(index)
									this.setFocus(index + 1)
									e.preventDefault() // Prevent delete next part
								}
							}}
							key={index}
							ref={el => (this.partElements[index] = el)}
							contenteditable={!(this.readonly || this.disabled)}>
							{/* year or month or day written here */}
						</span>
						<span class="ghost">{DateFormat.Part.getGuide(part, this.parts[part]?.length)}</span>
						{index < 2 && <span class="smoothly-date-separator">{this.separator}</span>}
					</span>
				))}
			</Host>
		)
	}
}
