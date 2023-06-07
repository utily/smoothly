import { Component, Fragment, h, Host } from "@stencil/core"
import { Layout, Placement } from "../Input"

@Component({
	tag: "smoothly-form-new-preview",
})
export class SmoothlyFormNewPreview {
	render() {
		return (
			<Host>
				<h4>Form controll</h4>
				<smoothly-form-new layout="grid" onSmoothlyFormInput={e => console.log(e.detail)}>
					<smoothly-input-new value="example@live.se" name="email" type="email">
						Email
					</smoothly-input-new>
					<smoothly-input-new value="123asd" name="password" type="password">
						Password
					</smoothly-input-new>
					<smoothly-clear slot="clear">Clear</smoothly-clear>
				</smoothly-form-new>
				<br />
				<smoothly-form-new readonly layout="grid" onSmoothlyFormInput={e => console.log(e.detail)}>
					<smoothly-input-new value="example@live.se" name="email" type="email">
						Email
					</smoothly-input-new>
					<smoothly-input-new value="123asd" name="password" type="password">
						Password
					</smoothly-input-new>
					<smoothly-edit slot="edit" label="Edit" fallback="Close" />
				</smoothly-form-new>
				<h4>Reactive form controll (hover)</h4>
				<smoothly-form-new reactive readonly layout="grid">
					<smoothly-input-new value="example@live.se" name="Email" type="email">
						Email
					</smoothly-input-new>
					<smoothly-input-new value="123asd" name="password" type="password">
						Password
					</smoothly-input-new>
					<smoothly-input-new name="Phone" value="0720000000" type="phone">
						Phone
					</smoothly-input-new>
					<smoothly-input-new name="name" value="Göran" type="name">
						Name
					</smoothly-input-new>
					<smoothly-clear slot="clear" color="secondary" />
					<smoothly-edit slot="edit" color="secondary" />
				</smoothly-form-new>
				<br />
				<br />
				<h4>Form submit</h4>
				<smoothly-form-new layout="grid" onSmoothlyFormSubmit={() => window.alert("Form submitted!")}>
					<smoothly-input-new placeholder="Aaa" name="email" type="email" required>
						Email
					</smoothly-input-new>
					<smoothly-input-new placeholder="Aaa" name="password" type="password" required>
						Password
					</smoothly-input-new>
					<smoothly-submit-new slot="submit">Submit</smoothly-submit-new>
				</smoothly-form-new>

				<h4>Form layout</h4>
				{["line", "border", "grid", "solid"].map((layout: Layout) => (
					<Fragment>
						<smoothly-form-new layout={layout} placement="float">
							<smoothly-input-new placeholder="Email" name="email" type="email">
								{layout.slice(0, 1).toUpperCase() + layout.slice(1)}
							</smoothly-input-new>
							<smoothly-input-new placeholder="Password" name="password" type="password">
								{layout.slice(0, 1).toUpperCase() + layout.slice(1)}
							</smoothly-input-new>
						</smoothly-form-new>
						<br />
						<br />
					</Fragment>
				))}

				<h4>Form placement</h4>
				{["float", "start", "top", "outside"].map((placement: Placement) => (
					<Fragment>
						<smoothly-form-new layout="border" placement={placement}>
							<smoothly-input-new placeholder="Email" name="email" type="email">
								{placement.slice(0, 1).toUpperCase() + placement.slice(1)}
							</smoothly-input-new>
							<smoothly-input-new placeholder="Password" name="password" type="password">
								{placement.slice(0, 1).toUpperCase() + placement.slice(1)}
							</smoothly-input-new>
						</smoothly-form-new>
						<br />
						<br />
					</Fragment>
				))}
			</Host>
		)
	}
}
