import { isoly } from "isoly"

export function month(date: isoly.Date): isoly.Date[][] {
	const d = new Date(date)
	d.setDate(1)
	let day = -((d.getDay() + 6) % 7) + 1
	const result: string[][] = []
	for (let row = 0; row < 6; row++) {
		const r = []
		for (let column = 0; column < 7; column++) {
			const d = new Date(date)
			d.setUTCDate(day++)
			r.push(isoly.Date.create(d))
		}
		if (row < 5 || isoly.Date.firstOfMonth(r[0]) == isoly.Date.firstOfMonth(date))
			result.push(r)
	}
	return result
}

export function weekdays(): string[] {
	const day = new globalThis.Date()
	day.setDate(day.getDate() - day.getDay() + 1)
	const result: string[] = []
	for (let i = 0; i < 7; i++) {
		result.push(day.toLocaleString(undefined, { weekday: "short" }))
		day.setDate(day.getDate() + 1)
	}
	return result
}

export function months(current: isoly.Date): { date: isoly.Date; name: string; selected?: boolean }[] {
	const day = new globalThis.Date(current)
	const result: { date: isoly.Date; name: string; selected?: boolean }[] = []
	for (let i = 0; i < 12; i++) {
		day.setMonth(i, 28)
		const date = isoly.Date.create(day)
		result.push({
			date,
			name: day.toLocaleString(undefined, { month: "long" }),
			selected: date.substr(0, 7) == current.substr(0, 7),
		})
	}
	return result
}
export function years(
	current: isoly.Date,
	min?: isoly.Date,
	max?: isoly.Date
): { date: isoly.Date; name: string; selected?: boolean }[] {
	const day = new globalThis.Date(current)
	const start = min ? isoly.Date.getYear(min) : new Date().getFullYear() - 50
	const end = max ? isoly.Date.getYear(max) : new Date().getFullYear() + 50
	const result: { date: isoly.Date; name: string; selected?: boolean }[] = []
	for (let i = start; i <= end; i++) {
		day.setFullYear(i)
		const date = isoly.Date.create(day)
		result.push({
			date,
			name: day.toLocaleString(undefined, { year: "numeric" }),
			selected: date == current,
		})
	}
	return result
}
