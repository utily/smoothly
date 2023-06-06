import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-form-new-preview",
})
export class SmoothlyFormNewPreview {
	render() {
		return (
			<Host>
				<smoothly-form-new readonly layout="grid" onSmoothlyFormInput={e => console.log(e.detail)}>
					<smoothly-input-new value="example@live.se" name="Email" type="email">
						Email
					</smoothly-input-new>
					<smoothly-input-new value="123asd" name="Password" type="password">
						Password
					</smoothly-input-new>
					<smoothly-input-new name="Phone" type="phone">
						Phone
					</smoothly-input-new>
					<smoothly-input-new value="björn" name="Name" type="text">
						Name
					</smoothly-input-new>
					<smoothly-clear slot="clear">Clear</smoothly-clear>
					<smoothly-edit slot="edit" label="Edit" fallback="Reset" />
				</smoothly-form-new>
			</Host>
		)
	}
}
