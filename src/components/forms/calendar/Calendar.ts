import * as isoly from "isoly"

export default class Calendar {
	static month(date: isoly.Date): isoly.Date[][] {
		const d = new Date(date)
		d.setDate(1)
		let day = -((d.getDay() + 6) % 7) + 1
		const result: string[][] = []
		for (let row = 0; row < 6; row++) {
			const r = []
			for (let column = 0; column < 7; column++) {
				const d = new Date(date)
				d.setDate(day++)
				r.push(isoly.Date.create(d))
			}
			if (row < 5 || isoly.Date.firstOfMonth(r[0]) == isoly.Date.firstOfMonth(date))
				result.push(r)
		}
		return result
	}

	static weekdays(): string[] {
		const day = new globalThis.Date()
		day.setDate(day.getDate() - day.getDay() + 1)
		const result: string[] = []
		for (let i = 0; i < 7; i++) {
			result.push(day.toLocaleString(undefined, { weekday: "short" }))
			day.setDate(day.getDate() + 1)
		}
		return result
	}

	static months(): { value: string; label: string }[] {
		const result: { value: string; label: string }[] = []
		const currentDate = new Date()
		for (let month = 0; month < 12; month++) {
			const date = new Date(currentDate.getFullYear(), month, 1)
			const value = (date.getMonth() + 1).toString().padStart(2, "0")
			const label = date.toLocaleString("default", { month: "long" })
			result.push({ value, label: label.slice(0, 1).toUpperCase() + label.slice(1) })
		}
		return result
	}

	static years(): { value: string }[] {
		const result: { value: string }[] = []
		const currentDate = new Date()
		const currentYear = currentDate.getFullYear()
		for (let yearOffset = -5; yearOffset <= 5; yearOffset++) {
			const year = currentYear + yearOffset
			result.push({ value: year.toString() })
		}
		return result
	}

	static getCurrentDateString() {
		const currentDate = new Date()
		const year = currentDate.getFullYear()
		const month = String(currentDate.getMonth() + 1).padStart(2, "0")
		const day = String(currentDate.getDate()).padStart(2, "0")
		return `${year}-${month}-${day}`
	}

	static adjustMonth(value: string, adjust: number) {
		const date = new Date(value)
		date.setMonth(date.getMonth() + adjust)

		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, "0")
		const day = String(date.getDate()).padStart(2, "0")

		return `${year}-${month}-${day}`
	}

	static adjustYear(value: string, adjust: number) {
		const date = new Date(value)
		date.setFullYear(date.getFullYear() + adjust)

		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, "0")
		const day = String(date.getDate()).padStart(2, "0")

		return `${year}-${month}-${day}`
	}

	static getMonthLabel(datetime: string): string {
		const date = new Date(datetime)
		const month = date.toLocaleString("default", { month: "long" })
		return month.slice(0, 1).toUpperCase() + month.slice(1)
	}
}
