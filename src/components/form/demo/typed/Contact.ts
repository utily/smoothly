import { isoly } from "isoly"
import { isly } from "isly"

export interface Contact {
	name: { first: string; middle?: string; last: string }
	age: number
	country: isoly.CountryCode.Alpha2
	birthday: isoly.Date
}
export namespace Contact {
	export const type = isly.object<Contact>({
		name: isly.object<Contact["name"]>({ first: isly.string(), middle: isly.string().optional(), last: isly.string() }),
		age: isly.number(age => 18 <= age && age <= 120),
		country: isly.fromIs("CountryCode", isoly.CountryCode.Alpha2.is),
		birthday: isly.fromIs("Date", isoly.Date.is),
	})
}
