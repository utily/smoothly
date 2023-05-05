import { Component, h, Host, State } from "@stencil/core"
import { data } from "./data"

@Component({
	tag: "smoothly-friday",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFriday {
	@State() counter = 0
	render() {
		return (
			<Host>
				<smoothly-table>
					<smoothly-table-row>
						<smoothly-table-header>Type</smoothly-table-header>
						<smoothly-table-header>Name</smoothly-table-header>
						<smoothly-table-header>Age</smoothly-table-header>
					</smoothly-table-row>
					{data.map(animal => (
						<smoothly-table-expandable-row>
							<smoothly-table-cell>{animal.type}</smoothly-table-cell>
							<smoothly-table-cell>{animal.name}</smoothly-table-cell>
							<smoothly-table-cell>{animal.age}</smoothly-table-cell>
							<smoothly-form slot="detail" onSmoothlyFormSubmit={() => this.counter++} looks="line">
								<smoothly-input value={animal.type}>Type</smoothly-input>
								<smoothly-input value={animal.name}>Name</smoothly-input>
								<smoothly-input>{animal.age}</smoothly-input>
								<smoothly-submit slot="submit">Submit!</smoothly-submit>
							</smoothly-form>
						</smoothly-table-expandable-row>
					))}
				</smoothly-table>
			</Host>
		)
	}
}
