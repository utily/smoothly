import { Component, h, Host, State } from "@stencil/core"
import { data } from "./data"
@Component({
	tag: "smoothly-table-testing",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableTesting {
	@State() counter = 0
	render() {
		return (
			<Host>
				<smoothly-table color="dark">
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
					{data.map(animal => (
						<smoothly-table-row>
							<smoothly-table-cell>{animal.type}</smoothly-table-cell>
							<smoothly-table-expandable-cell>
								{animal.name}
								<smoothly-form slot="detail" onSmoothlyFormSubmit={() => this.counter++} looks="line">
									<smoothly-input value={animal.name}>Name</smoothly-input>
									<smoothly-submit slot="submit">Submit!</smoothly-submit>
								</smoothly-form>
							</smoothly-table-expandable-cell>
							<smoothly-table-expandable-cell>
								{animal.age}
								<smoothly-form slot="detail" onSmoothlyFormSubmit={() => this.counter++} looks="line">
									<smoothly-input value={animal.type}>Type</smoothly-input>
									<smoothly-input value={animal.name}>Name</smoothly-input>
									<smoothly-input>{animal.age}</smoothly-input>
									<smoothly-submit slot="submit">Submit!</smoothly-submit>
								</smoothly-form>
							</smoothly-table-expandable-cell>
						</smoothly-table-row>
					))}
					<smoothly-table-footer>
						<td colSpan={2}>
							<div class="footer">
								Currently viewing content from:
								<smoothly-display type="date" value="2023-10-12" />
							</div>
						</td>
						<smoothly-table-header>{"Total age: " + data.reduce((r, a) => r + a.age, 0)}</smoothly-table-header>
					</smoothly-table-footer>
				</smoothly-table>
			</Host>
		)
	}
}
