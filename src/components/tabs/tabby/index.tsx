import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-tabby",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabs {
	@State() selectedTab1: number = 4
	@State() selectedTab2: number = 4
	@State() selectedTab3: number = 4

	render() {
		return (
			<Host>
				<div>
					{["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven"].map(
						(tab, index) => (
							<div class={{ selected: this.selectedTab1 === index }} onClick={() => (this.selectedTab1 = index)}>
								{tab}
							</div>
						)
					)}
				</div>

				<div>
					{["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven"].map(
						(tab, index) => (
							<div class={{ selected: this.selectedTab2 === index }} onClick={() => (this.selectedTab2 = index)}>
								{tab}
							</div>
						)
					)}
				</div>

				<div>
					{["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven"].map(
						(tab, index) => (
							<div class={{ selected: this.selectedTab3 === index }} onClick={() => (this.selectedTab3 = index)}>
								{tab}
							</div>
						)
					)}
				</div>
			</Host>
		)
	}
}
