import { Component, h, Host, VNode } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-checkbox-demo",
	scoped: true,
})
export class SmoothlyInputCheckboxDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>All inputs</h2>
				<smoothly-form looks="grid" readonly action="https://api.toiletapi.com/6b12fd2f-e896-46f9-b38f-25cf42cee4b4">
					<smoothly-input readonly name="First Name" value="John">
						First name
					</smoothly-input>
					<smoothly-input name="Last name" value="Doe">
						Last name
						<smoothly-input-clear size="icon" slot="end"></smoothly-input-clear>
					</smoothly-input>
					<smoothly-input type="phone" name="Phone" value={"777888999"}>
						Phone
						<smoothly-input-reset size="icon" slot="end"></smoothly-input-reset>
					</smoothly-input>
					<smoothly-input-radio clearable name="radioFirstInput">
						<p slot="label">Clearable</p>
						<smoothly-input-radio-item slot="options" value={"first"}>
							Label 1
						</smoothly-input-radio-item>
						<smoothly-input-radio-item selected slot="options" value={"second"}>
							Label 2
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"third"}>
							Label 3
						</smoothly-input-radio-item>
					</smoothly-input-radio>
					<smoothly-input-color name="color" value={"#479f56"} output="rgb">
						Color
					</smoothly-input-color>
					<smoothly-input-select menuHeight="7.5items" placeholder="Select..." multiple name="select-month">
						<label slot="label">Month</label>
						<smoothly-item value="1">January</smoothly-item>
						<smoothly-item value="2">February</smoothly-item>
						<smoothly-item value="3">March</smoothly-item>
						<smoothly-item value="4">April</smoothly-item>
						<smoothly-item value="5">May</smoothly-item>
						<smoothly-item value="6">June</smoothly-item>
						<smoothly-item value="7">July</smoothly-item>
						<smoothly-item value="8">August</smoothly-item>
						<smoothly-item value="9">September</smoothly-item>
						<smoothly-item value="10">October</smoothly-item>
						<smoothly-item value="11">November</smoothly-item>
						<smoothly-item value="12">December</smoothly-item>
						<smoothly-input-clear size="icon" slot="end"></smoothly-input-clear>
					</smoothly-input-select>
					<smoothly-input-select name="select-icon" clearable={false} showSelected={false}>
						<smoothly-item value="folder" selected>
							<smoothly-icon size="small" name="folder-outline" />
						</smoothly-item>
						<smoothly-item value="camera">
							<smoothly-icon size="small" name="camera-outline" />
						</smoothly-item>
					</smoothly-input-select>
					<smoothly-input-checkbox name="checkbox">Check the box</smoothly-input-checkbox>
					<smoothly-input-checkbox name="checkbox2" checked>
						Check the box 2
					</smoothly-input-checkbox>
					<smoothly-input-date-range start={isoly.Date.now()} end={isoly.Date.now()}></smoothly-input-date-range>
					<smoothly-input-date name="date">
						Date
						<smoothly-input-clear slot="end"></smoothly-input-clear>
					</smoothly-input-date>
					<smoothly-input-range step={1} name="range3" value={20000}>
						Select
					</smoothly-input-range>
					<smoothly-input name="pets.0.name">First Pet's Name</smoothly-input>
					<smoothly-input-range name="pets.0.age" max={100} step={1}>
						First Pet's Age
					</smoothly-input-range>
					<smoothly-input name="pets.1.name">Second Pet's Name</smoothly-input>
					<smoothly-input-range name="pets.1.age" max={100} step={1}>
						Second Pet's Age
					</smoothly-input-range>
					<smoothly-input name="pets.2.name">Third Pet's Name</smoothly-input>
					<smoothly-input-range name="pets.2.age" max={100} step={1}>
						Third Pet's Age
					</smoothly-input-range>
					<smoothly-input-file name={"profile"} placeholder={"Click or drag your profile picture here..."}>
						<span slot={"label"}>Profile</span>
						<smoothly-icon slot={"button"} name={"person-circle-outline"} size={"tiny"} fill={"default"} />
					</smoothly-input-file>
					<smoothly-input-clear fill="default" type="form" color="warning" slot="clear" size="icon" shape="rounded" />
					<smoothly-input-edit fill="default" type="form" color="tertiary" slot="edit" size="icon" shape="rounded" />
					<smoothly-input-reset fill="default" type="form" color="warning" slot="reset" size="icon" shape="rounded" />
					<smoothly-input-submit delete slot="delete" color="danger" size="icon" shape="rounded" />
					<smoothly-input-submit
						fill="default"
						color="success"
						slot="submit"
						size="icon"
						shape="rounded"></smoothly-input-submit>
				</smoothly-form>
			</Host>
		)
	}
}
