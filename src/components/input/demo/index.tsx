import { Component, h, Host, Listen, State } from "@stencil/core"
import { Notice } from "../../../model"
import { SmoothlyForm } from "../../form"
@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
})
export class SmoothlyInputDemo {
	private selectElement: HTMLSmoothlyInputSelectElement

	@Listen("selectionChanged")
	handleSelectionChanged(event: CustomEvent<{ identifier: string; value: string }>) {
		console.log("selectionChanged", event.detail)
	}

	options = [
		{ value: "January", label: "January" },
		{ value: "February", label: "February" },
		{ value: "March", label: "March" },
		{ value: "April", label: "April" },
		{ value: "May", label: "May" },
		{ value: "June", label: "June" },
		{ value: "July", label: "July" },
		{ value: "August", label: "August" },
		{ value: "September", label: "September" },
		{ value: "October", label: "October" },
		{ value: "November", label: "November" },
		{ value: "December", label: "December" },
	]
	@State() private looks: SmoothlyForm["looks"] = "grid"
	render() {
		return (
			<Host>
				<two-test>Test</two-test>
				<h2>Input Demo</h2>
				<h3>Input types</h3>
				<div class="customSelect">
					<label>Form Looks</label>
					<smoothly-input-select
						value={"grid"}
						name="Mylooks"
						options={[{ value: "grid" }, { value: "plain" }, { value: "line" }, { value: "border" }]}
						onSmoothlyInput={e => (this.looks = e.detail.Mylooks as any)}
					/>
				</div>
				<br />
				<smoothly-form looks={this.looks} onSmoothlyFormInput={e => console.log(e.detail)}>
					<smoothly-form-controll label="Email">
						<smoothly-input type="email" name="email" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Password">
						<smoothly-input type="password" name="password" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Phone">
						<smoothly-input type="phone" name="phone" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Zip">
						<smoothly-input type="postal-code" name="zip" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Card-number">
						<smoothly-input type="card-number" name="card-number" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Card expire">
						<smoothly-input type="card-expires" name="expires" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Card-csc">
						<smoothly-input type="card-csc" name="csc" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Price">
						<smoothly-input type="price" currency="SEK" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Percent">
						<smoothly-input type="percent" name="percent" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Divisor">
						<smoothly-input type="divisor" name="divisor" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Date-time">
						<smoothly-input type="date-time" name="date-time" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Date">
						<smoothly-input type="date" name="date" />
					</smoothly-form-controll>
				</smoothly-form>
				<br />
				<br />
				<h3>Select types</h3>
				<smoothly-form looks="border">
					<smoothly-form-controll label="Filter Multiple">
						<smoothly-input-select multiple name="FilterMultiple" options={this.options} />
					</smoothly-form-controll>
					<smoothly-form-controll label="Filter">
						<smoothly-input-select name="Filter" options={this.options} />
					</smoothly-form-controll>
					<smoothly-form-controll label="Filterable">
						<smoothly-input-select filterable name="Filterable" options={this.options} />
					</smoothly-form-controll>
				</smoothly-form>
				<br />
				<br />
				<h3>Date picker types</h3>
				<smoothly-form looks="border">
					<smoothly-form-controll label="Year">
						<smoothly-input-date name="Year" />
					</smoothly-form-controll>
					<smoothly-form-controll>
						<smoothly-input-date-range name="dateRange" min="2023-01-10" max="2023-12-30" />
					</smoothly-form-controll>
				</smoothly-form>
				<br />
				<br />
				<h3>File Input (dropzone)</h3>
				<smoothly-form looks="border">
					<smoothly-form-controll label="Attachments">
						<smoothly-input-file name="attachment" />
					</smoothly-form-controll>
				</smoothly-form>
				<br />
				<br />
				<h3>Form Controll</h3>
				<smoothly-form looks="border">
					<smoothly-form-controll label="Email" placeholder="Write something awsome">
						<smoothly-input type="email" name="email" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Attachment" placeholder="Select or drop attachment here" icon="folder">
						<smoothly-input-file name="attachment" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Password" icon="lock-closed">
						<smoothly-input type="password" name="password" value="asdasd" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Year" icon="calendar">
						<smoothly-input-date name="Year" />
					</smoothly-form-controll>

					<smoothly-form-controll label="Filter" endIcon="chevron-down">
						<smoothly-input-select name="Filter" options={this.options} />
					</smoothly-form-controll>
					<smoothly-form-controll label="Filterable" icon="list" endIcon="chevron-down">
						<smoothly-input-select filterable name="Filterable" options={this.options} />
					</smoothly-form-controll>
				</smoothly-form>
				<br />
				<br />
				<h3>Form Controll Clearable</h3>
				<smoothly-form looks="border">
					<smoothly-form-controll label="Email" clearable>
						<smoothly-input type="email" name="email" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Password" icon="lock-closed" clearable>
						<smoothly-input type="password" name="password" value="asdasd" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Year" icon="calendar" clearable>
						<smoothly-input-date name="Year" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Filter Multiple" clearable>
						<smoothly-input-select
							value={["January", "February"]}
							multiple
							name="FilterMultiple"
							options={this.options}
						/>
					</smoothly-form-controll>
				</smoothly-form>
				<br />
				<br />
				<h3>Form Controll Editable</h3>
				<smoothly-form looks="border" readonly>
					<smoothly-form-controll label="Email" editable>
						<smoothly-input type="email" name="email" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Password" icon="lock-closed" editable>
						<smoothly-input type="password" name="password" value="asdasd" />
					</smoothly-form-controll>
				</smoothly-form>
				<br />
				<br />
				<h3>Form Clear</h3>
				<smoothly-form looks="border">
					<smoothly-form-controll label="Email">
						<smoothly-input type="email" name="email" value="example@gmail.com" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Password" icon="lock-closed">
						<smoothly-input type="password" name="password" value="asdasd" />
					</smoothly-form-controll>
					<smoothly-input-clear slot="clear">Clear</smoothly-input-clear>
				</smoothly-form>
				<h3>Form Edit</h3>
				<smoothly-form looks="border" readonly>
					<smoothly-form-controll label="Email">
						<smoothly-input type="email" name="email" value="example@gmail.com" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Password" icon="lock-closed">
						<smoothly-input type="password" name="password" value="asdasd" />
					</smoothly-form-controll>
					<smoothly-input-edit slot="edit">Edit</smoothly-input-edit>
				</smoothly-form>
				<h3>Combined Form & Controll (Editable/Clearable)</h3>
				<smoothly-form looks="border" readonly>
					<smoothly-form-controll label="Email" clearable>
						<smoothly-input type="email" name="email" value="example@gmail.com" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Password" icon="lock-closed" clearable editable>
						<smoothly-input type="password" name="password" value="asdasd" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Year" icon="calendar" clearable>
						<smoothly-input-date name="Year" value="2023-05-05" />
					</smoothly-form-controll>
					<smoothly-form-controll label="Filter" clearable endIcon="chevron-down" editable>
						<smoothly-input-select readonly value="January" name="Filter" options={this.options} />
					</smoothly-form-controll>
					<smoothly-input-edit slot="edit">Edit</smoothly-input-edit>
					<smoothly-input-clear slot="clear">Clear</smoothly-input-clear>
				</smoothly-form>
				<br />
				<br />
				<br />
				<br />
				<br />
				{/* <br />  Fortsätt emd exempel här nedanför */}
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<h2>Submit</h2>
				<smoothly-form looks="border">
					<smoothly-input type="email" name="email">
						Email
					</smoothly-input>
					<smoothly-input type="password" name="password">
						Password
					</smoothly-input>
					<smoothly-submit slot="submit">Submit</smoothly-submit>
				</smoothly-form>
				<br />
				<br />
				<br />
				<br />
				<br />
				{/* <br />  Fortsätt emd exempel här nedanför */}
				<br />
				<br />
				<br />
				<br />
				<br />
				<h4>Smoothly checkboxes</h4>,
				<smoothly-form>
					<div>
						<smoothly-checkbox>
							Check me
							<div slot="expansion">Some context</div>
						</smoothly-checkbox>
						<smoothly-checkbox>Label</smoothly-checkbox>
						<smoothly-checkbox disabled={true} />
					</div>
				</smoothly-form>
				,<h4>Smoothly Radio Buttons</h4>,
				<smoothly-form onSmoothlyFormSubmit={e => console.log(e.detail)}>
					<smoothly-radio-button name="radioButtonDemo" deselectable decoration="button">
						<smoothly-radio-button-item value={"test"}>
							Option 1<div slot="expansion">Some description.</div>
						</smoothly-radio-button-item>
						<smoothly-radio-button-item value={{ some: "thing", yes: "miss" }}>
							Option 2<div slot="expansion">Some other description.</div>
						</smoothly-radio-button-item>
						<smoothly-radio-button-item value={{ some: "one", yes: "kid" }}>
							Option 3<div slot="expansion">Some third description.</div>
						</smoothly-radio-button-item>
					</smoothly-radio-button>
					<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
						<smoothly-icon name="checkmark-circle"></smoothly-icon>
					</smoothly-submit>
				</smoothly-form>
				,<h4>Radio List without button 1</h4>,
				<smoothly-form>
					<smoothly-radio-button name="RadioListWithoutButton">
						<smoothly-radio-button-item value={{ some: "content", yes: "sir" }} selected color="light">
							<span>Option 1</span>
							<span slot="expansion">Some description.</span>
						</smoothly-radio-button-item>
						<smoothly-radio-button-item value={{ some: "thing", yes: "miss" }} color="light">
							<span>Option 2</span>
							<span slot="expansion">Some other description.</span>
						</smoothly-radio-button-item>
						<smoothly-radio-button-item value={{ some: "one", yes: "kid" }} color="light">
							<span>Option 3</span>
							<span slot="expansion">Some third description.</span>
						</smoothly-radio-button-item>
					</smoothly-radio-button>
					<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
						<smoothly-icon name="checkmark-circle"></smoothly-icon>
					</smoothly-submit>
				</smoothly-form>
				,<h4>Radio List without button 2</h4>,
				<smoothly-form>
					<smoothly-radio name="option" value="1a" style={{ width: "100%" }}>
						option 1
					</smoothly-radio>
					<smoothly-radio name="option" value="2a" checked style={{ width: "100%" }}>
						option 2
					</smoothly-radio>
					<smoothly-radio name="option" value="3a" style={{ width: "100%" }}>
						option 3
					</smoothly-radio>
				</smoothly-form>
				,<h4>Smoothly Accordion</h4>,
				<smoothly-form>
					<smoothly-accordion>
						<smoothly-accordion-item name="A" open>
							<smoothly-radio name="a" value="1b">
								a 1
							</smoothly-radio>
							<smoothly-radio name="a" value="2b" checked>
								a 2
							</smoothly-radio>
							<smoothly-radio name="a" value="3b">
								a 3
							</smoothly-radio>
						</smoothly-accordion-item>
						<smoothly-accordion-item name="B">
							<smoothly-radio name="b" value="1c">
								b 1
							</smoothly-radio>
							<smoothly-radio name="b" value="2c">
								b 2
							</smoothly-radio>
							<smoothly-radio name="b" value="3c">
								b 3
							</smoothly-radio>
						</smoothly-accordion-item>
					</smoothly-accordion>
					<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
						<smoothly-icon name="checkmark-circle"></smoothly-icon>
					</smoothly-submit>
				</smoothly-form>
				,<h4>Smoothly Picker</h4>,
				<smoothly-form
					onSmoothlyFormSubmit={e => console.log("submitted", e.detail)}
					style={{ "max-width": "50rem" }}
					looks="line">
					<smoothly-input name="purpose" type="text">
						Purpose
					</smoothly-input>
					<smoothly-picker
						multiple
						mutable
						name="emails"
						validator={value =>
							value.match(/^.+@.+/) ? true : { result: false, notice: Notice.failed("That is not an email") }
						}>
						<span slot="label">Emails</span>
						<span slot="search">Search</span>
						<smoothly-picker-option value={"james@rocket.com"}>james@rocket.com</smoothly-picker-option>
						<smoothly-picker-option selected value={"jessie@rocket.com"}>
							jessie@rocket.com
						</smoothly-picker-option>
						<smoothly-picker-option value={"giovanni@rocket.com"}>giovanni@rocket.com</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-submit slot="submit">Submit</smoothly-submit>
					<smoothly-input-clear color="danger" fill="solid" slot="clear">
						Clear
					</smoothly-input-clear>
					<smoothly-picker label="Shape" name="shape">
						<smoothly-picker-option name="Circle" value={"circle"} labeled>
							<smoothly-icon name="ellipse-outline" />
						</smoothly-picker-option>
						<smoothly-picker-option name="Cube" value={"cube"} labeled>
							<smoothly-icon name="cube-outline" />
						</smoothly-picker-option>
						<smoothly-picker-option name="Square" value={"square"} selected labeled>
							<smoothly-icon name="square-outline" />
						</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-picker multiple readonly name="animals">
						<span slot="label">Animals</span>
						<span slot="search">Search</span>
						<smoothly-picker-option selected value={"cat"}>
							Cat
						</smoothly-picker-option>
						<smoothly-picker-option value={"dog"}>Dog</smoothly-picker-option>
						<smoothly-picker-option value={"fish"}>Fish</smoothly-picker-option>
					</smoothly-picker>
				</smoothly-form>
				,
				<smoothly-picker-tester />,<smoothly-backtotop></smoothly-backtotop>,<h4>Smoothly Date</h4>,
				<smoothly-input-date>Date</smoothly-input-date>,
				<smoothly-input-date value="2021-10-28" max="2021-12-30" min="2021-10-10">
					Date
				</smoothly-input-date>
				,
				<smoothly-input-date-range
					start="2022-10-28"
					end="2022-11-27"
					min="2021-10-10"
					max="2022-12-30"></smoothly-input-date-range>
				,
				<smoothly-input-date-range
					start="2022-10-28"
					end="2022-11-27"
					min="2021-10-10"
					max="2022-12-30"
					style={{
						"--border-radius": "4px",
						"--padding": "0 0.75em",
						"--input-width": "6rem",
					}}></smoothly-input-date-range>
				,
				<br />,<h4>Smoothly Selector</h4>,
				<smoothly-input-select ref={(element: HTMLSmoothlyInputSelectElement) => (this.selectElement = element)}>
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
				</smoothly-input-select>
				,<button onClick={async () => this.selectElement.clear()}>Reset select</button>,
				<smoothly-form looks="line" onSmoothlyFormSubmit={e => console.log("Submitted", e.detail)}>
					<smoothly-input type="text" name="text">
						Text
					</smoothly-input>
					<smoothly-input-file placeholder="Select or drag a file here" name="file">
						<span slot="label">Testing file input</span>
						<smoothly-icon slot="button" name="folder-outline" />
					</smoothly-input-file>
					<smoothly-submit slot="submit">Submit</smoothly-submit>
				</smoothly-form>
				,
				<br />,
			</Host>
		)
	}
}
