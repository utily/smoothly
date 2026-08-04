export type Range = { start: number; end: number }

export namespace Range {
	export type Value = number | Range
	export function is(value: Value | undefined): value is Range {
		return typeof value == "object" && value != undefined
	}
	export function clamp(value: number, min: number, max: number): number {
		return value < min ? min : value > max ? max : value
	}
	export function round(value: number, step: number | undefined): number {
		const decimals = !step ? undefined : (step.toString().split(".")[1]?.length ?? 0)
		return +value.toFixed(decimals)
	}
	export function setPart(current: Range, part: "start" | "end", value: number, min: number, max: number): Range {
		const clamped = clamp(value, min, max)
		return part == "start"
			? { start: Math.min(clamped, current.end), end: current.end }
			: { start: current.start, end: Math.max(clamped, current.start) }
	}
	export function equals(a: Value | undefined, b: Value | undefined): boolean {
		return is(a) && is(b) ? a.start == b.start && a.end == b.end : a === b
	}
	export function defined(value: Value | undefined): boolean {
		return is(value) ? typeof value.start == "number" && typeof value.end == "number" : typeof value == "number"
	}
	export function percent(value: number, min: number, max: number): number {
		return max == min ? 0 : ((value - min) / (max - min)) * 100
	}
}
