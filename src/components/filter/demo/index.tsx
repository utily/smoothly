import { Component, ComponentWillLoad, h, Host, Listen, State } from "@stencil/core"
import { selectively } from "selectively"
import * as http from "cloudly-http"
import { Selector } from "../../table/Selector"
import { Cat, Root } from "./Root"

@Component({
	tag: "smoothly-filter-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterDemo implements ComponentWillLoad {
	@State() criteria: selectively.Criteria = {}
	@State() data?: Root | false
	@State() selector: Selector<Cat> = Selector.create("breed")
	@Listen("smoothlyFilter")
	onFilterUpdate(event: CustomEvent<selectively.Criteria>) {
		event.stopPropagation()
		this.criteria = event.detail
	}
	@Listen("smoothlyInput")
	smoothlyInputHandler(event: CustomEvent<Record<string, any>>) {
		event.stopPropagation()
		this.selector = this.selector.handle(event.detail)
	}

	async componentWillLoad(): Promise<void> {
		const response = await http.fetch("https://catfact.ninja/breeds?limit=10")
		this.data = response.status == 200 && (await response.body)
	}

	render() {
		return (
			<Host>
				<smoothly-filter>
					<smoothly-icon slot="bar" name="search-outline" size="small" />
					<smoothly-filter-picker property="origin" slot="bar" multiple={false}>
						{this.data &&
							this.data.data.map(
								cat => cat.origin && <smoothly-picker-option value={cat.origin}>{cat.origin}</smoothly-picker-option>
							)}
					</smoothly-filter-picker>
					{/* <div slot="detail">
						<smoothly-form looks="border">
							<smoothly-filter-input name="breed" placeholder="ex. Abyssinian">
								Breed
								<smoothly-icon slot="start" name="search-outline" size="small" />
							</smoothly-filter-input>
							<smoothly-filter-input name="country" placeholder="ex. Ethiopia">
								Country
								<smoothly-icon slot="start" name="search-outline" size="small" />
							</smoothly-filter-input>
							<smoothly-filter-input name="coat" placeholder="ex. Short">
								Coat
								<smoothly-icon slot="start" name="search-outline" size="small" />
							</smoothly-filter-input>
							<smoothly-filter-input name="pattern" placeholder="ex. Ticked">
								Pattern
								<smoothly-icon slot="start" name="search-outline" size="small" />
							</smoothly-filter-input>
						</smoothly-form>
					</div> */}
				</smoothly-filter>
				<smoothly-filter>
					<smoothly-filter-picker property="origin" slot="bar" multiple={true}>
						{this.data &&
							this.data.data.map(
								cat => cat.origin && <smoothly-picker-option value={cat.origin}>{cat.origin}</smoothly-picker-option>
							)}
					</smoothly-filter-picker>
				</smoothly-filter>
				<smoothly-filter>
					<smoothly-icon slot="start" name="search-outline" size="small" />
				</smoothly-filter>
			</Host>
		)
	}
}
