import { Component, Element, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { selectively } from "selectively"
import { isly } from "isly"
import { Looks } from "../../input/Looks"
import { Filter } from "../Filter"

@Component({
	tag: "smoothly-filter-select",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterSelect implements Filter {
	private selectElement?: HTMLSmoothlyInputSelectElement
	updating = false
	items: Map<string, { state: Record<string, any>; item: HTMLSmoothlyItemElement }> = new Map<
		string,
		{ state: Record<string, any>; item: HTMLSmoothlyItemElement }
	>()
	@Element() element: HTMLSmoothlyFilterSelectElement
	@Prop() label: string
	@Prop() property: string
	@Prop() menuHeight?: `${number}items` | `${number}rem` | `${number}px` | `${number}vh` | undefined
	@Prop() multiple = false
	@Prop() type: "array" | "string" = "string"
	@Prop({ mutable: true }) looks?: Looks
	@Event() smoothlyFilterUpdate: EventEmitter<Filter.Update>
	@Event() smoothlyFilterManipulate: EventEmitter<Filter.Manipulate>
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks) => void>
	componentWillLoad() {
		this.smoothlyInputLooks.emit(looks => (this.looks = this.looks ?? looks))
	}
	async componentDidLoad() {
		this.smoothlyFilterUpdate.emit(this.update.bind(this))
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: any) => void>): Promise<void> {
		;(await this.selectElement?.getItems())?.forEach(item =>
			this.items.set(item.value, {
				state: this.property.split(".").reduceRight((r, e) => ({ [e]: r }), item.value),
				item,
			})
		)
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks?: Looks) => void>): void {
		if (event.target != this.element) {
			event.stopPropagation()
			event.detail(this.looks)
		}
	}
	update(expression: selectively.Criteria): void {
		this.updating = true
		if (expression instanceof selectively.And && expression.rules.length > 0)
			for (const item of this.items.values()) {
				const selected = expression.rules.some(
					r =>
						this.isCriteria(r, this.property, item.state) &&
						(this.type == "array" ? this.findInstanceOf(r, this.property) : r.is(item.state))
				)
				item.item.selected = selected
			}
		else
			this.items.forEach(item => (item.item.selected = false))
		this.updating = false
	}
	private isCriteria(criteria: selectively.Rule | undefined, key: string, value: Record<string, any> | any): boolean {
		const [property, ...rest] = key.split(".")
		const result =
			criteria instanceof selectively.Property && criteria.name == property
				? this.isCriteria(criteria.criteria, rest.join("."), value[property])
				: this.multiple
				? (criteria instanceof selectively.Within && criteria.value.some(e => e == value)) ||
				  (this.type == "array" && criteria instanceof selectively.Contains && criteria.criteria.some(e => e == value))
				: criteria instanceof selectively.Is && criteria.value == value
		return result
	}
	selectHandler(event: CustomEvent<Record<string, unknown>>) {
		event.stopPropagation()
		if (!this.updating) {
			const argument = event.detail[this.property]
			const manipulate = (criteria: selectively.Criteria): selectively.Criteria => {
				let result: selectively.Criteria = criteria
				const newCriteria = this.getCriteria(argument)
				if (!(result instanceof selectively.Rule))
					result = newCriteria ? selectively.and(result, newCriteria) : result
				else if (result instanceof selectively.And) {
					const index = result.rules.findIndex(r => this.findInstanceOf(r, this.property))
					!newCriteria && index >= 0
						? result.rules.splice(index, 1)
						: !newCriteria
						? undefined
						: index == -1
						? result.rules.push(newCriteria)
						: (result.rules[index] = newCriteria)
					result = selectively.and(...result.rules)
				}
				return result
			}
			this.smoothlyFilterManipulate.emit(manipulate.bind(this))
		}
	}
	findInstanceOf(criteria: selectively.Criteria, key: string): boolean {
		const [property, ...rest] = key.split(".")
		return (
			criteria instanceof selectively.Property &&
			criteria.name == property &&
			(criteria.criteria instanceof selectively.Within ||
				criteria.criteria instanceof selectively.Is ||
				criteria.criteria instanceof selectively.Contains ||
				(criteria.criteria instanceof selectively.Property && this.findInstanceOf(criteria.criteria, rest.join("."))))
		)
	}
	private getCriteria(detail: unknown): selectively.Rule | undefined {
		let result: selectively.Criteria | undefined
		if (this.multiple && isly.string().array({ criteria: "minLength", value: 1 }).is(detail))
			result = this.type == "array" ? selectively.contains(detail) : selectively.within(detail)
		else if (typeof detail == "string")
			result = selectively.is(detail)
		else
			result = undefined
		return result && this.property.split(".").reduceRight((r, e) => selectively.property(e, r), result)
	}

	render() {
		return (
			<smoothly-input-select
				ref={e => (this.selectElement = e)}
				name={this.property}
				looks={this.looks}
				multiple={this.multiple}
				menuHeight={this.menuHeight}
				onSmoothlyInputLooks={e => e.stopPropagation()}
				onSmoothlyItemSelect={e => e.stopPropagation()}
				onSmoothlyInput={e => this.selectHandler(e)}>
				{this.label && (
					<span slot="label">
						{[this.label.slice(0, 1).toUpperCase(), this.label.slice(1, this.label.length)].join("")}
					</span>
				)}
				<slot name="items"></slot>
			</smoothly-input-select>
		)
	}
}
