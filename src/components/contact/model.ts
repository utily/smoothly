import { isoly } from "isoly"
import { Type } from "tidily"

export namespace Address {
	export namespace Default {
		export type Field = keyof Omit<isoly.Address.Default, "countryCode">
		export type Mapping = [Field, { type: Type; required: boolean; value?: string }][]
		export const mapping: Mapping = [
			["street", { type: "text", required: true }],
			["city", { type: "text", required: true }],
			["zipCode", { type: "text", required: true }],
			["county", { type: "text", required: false }],
			["state", { type: "text", required: false }],
		]
		export function toMapping(address: isoly.Address[Address.CountryCode]): Mapping {
			return isoly.Address.Default.is(address)
				? mapping.map(([field, data]) => [field, { ...data, value: address[field] }])
				: mapping
		}
	}
	export namespace GB {
		export type Field = keyof Omit<isoly.Address.GB, "countryCode">
		export type Mapping = [Field, { type: Type; required: boolean; value?: string }][]
		export const mapping: Mapping = [
			["building", { type: "text", required: true }],
			["street", { type: "text", required: true }],
			["city", { type: "text", required: true }],
			["zipCode", { type: "text", required: true }],
		]
		export function toMapping(address: isoly.Address[Address.CountryCode]): Mapping {
			return isoly.Address.GB.is(address)
				? mapping.map(([field, data]) => [field, { ...data, value: address[field] }])
				: mapping
		}
	}
	export namespace SE {
		export type Field = keyof Omit<isoly.Address.SE, "countryCode">
		export type Mapping = [Field, { type: Type; required: boolean; value?: string }][]
		export const mapping: Mapping = [
			["street", { type: "text", required: true }],
			["city", { type: "text", required: true }],
			["zipCode", { type: "postal-code", required: true }],
		]
		export function toMapping(address: isoly.Address[Address.CountryCode]): Mapping {
			return isoly.Address.SE.is(address)
				? mapping.map(([field, data]) => [field, { ...data, value: address[field] }])
				: mapping
		}
	}
	export const countryCodes = ["GB", "SE"] as const
	export type CountryCode = "default" | typeof countryCodes[number]
	export function getCountryCode(code: isoly.CountryCode.Alpha2): CountryCode {
		return countryCodes.find(country => country == code) ?? "default"
	}
	export type Mapping = Default.Mapping | GB.Mapping | SE.Mapping
	export function toMapping(address: isoly.Address[Address.CountryCode]): Mapping {
		let result: Mapping
		switch (getCountryCode(address.countryCode)) {
			case "GB":
				result = GB.toMapping(address)
				break
			case "SE":
				result = SE.toMapping(address)
				break
			case "default":
				result = Default.toMapping(address)
				break
			default:
				result = Default.mapping
		}
		return result
	}
	export const mapping = {
		default: Default.mapping,
		GB: GB.mapping,
		SE: SE.mapping,
	}
}
