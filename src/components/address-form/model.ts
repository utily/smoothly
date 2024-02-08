import { isoly } from "isoly"
import { Type } from "tidily"

interface MappedField {
	type: Type
	display: string
	required?: boolean
	value?: string
}
export namespace Address {
	export namespace Default {
		export type Field = keyof Omit<isoly.Address.Default, "countryCode">
		export type Mapping = [Field, MappedField][]
		export const mapping: Mapping = [
			["street", { type: "text", display: "Street", required: true }],
			["city", { type: "text", display: "City", required: true }],
			["zipCode", { type: "text", display: "Zip Code", required: true }],
			["county", { type: "text", display: "County" }],
			["state", { type: "text", display: "State" }],
		]
		export function toMapping(address?: isoly.Address[Address.Code.Type]): Mapping {
			return isoly.Address.Default.is(address)
				? mapping.map(([field, data]) => [field, { ...data, value: address[field] }])
				: mapping
		}
	}
	export namespace GB {
		export type Field = keyof Omit<isoly.Address.GB, "countryCode">
		export type Mapping = [Field, MappedField][]
		export const mapping: Mapping = [
			["building", { type: "text", display: "Building", required: true }],
			["street", { type: "text", display: "Street", required: true }],
			["city", { type: "text", display: "City", required: true }],
			["zipCode", { type: "text", display: "Zip Code", required: true }],
		]
		export function toMapping(address?: isoly.Address[Address.Code.Type]): Mapping {
			return isoly.Address.GB.is(address)
				? mapping.map(([field, data]) => [field, { ...data, value: address[field] }])
				: mapping
		}
	}
	export namespace SE {
		export type Field = keyof Omit<isoly.Address.SE, "countryCode">
		export type Mapping = [Field, MappedField][]
		export const mapping: Mapping = [
			["street", { type: "text", display: "Street", required: true }],
			["city", { type: "text", display: "City", required: true }],
			["zipCode", { type: "postal-code", display: "Zip Code", required: true }],
		]
		export function toMapping(address?: isoly.Address[Address.Code.Type]): Mapping {
			return isoly.Address.SE.is(address)
				? mapping.map(([field, data]) => [field, { ...data, value: address[field] }])
				: mapping
		}
	}
	export namespace Code {
		export const types = ["GB", "SE"] as const
		export type Type = "default" | typeof types[number]
		export function from(alpha2?: isoly.CountryCode.Alpha2): Type {
			return types.find(country => country == alpha2) ?? "default"
		}
		export function is(value: any | Type): value is Type {
			return value && typeof value == "string" && (types.find(type => type == value) || value == "default")
		}
	}
	export type Recipient = Recipient.Field[] | Partial<Record<Recipient.Field, { required?: boolean; value?: string }>>
	export namespace Recipient {
		export const fields = [
			"name",
			"name.first",
			"name.last",
			"title",
			"department",
			"company",
			"phone",
			"email",
		] as const
		export type Field = typeof fields[number]
		export type Mapping = [Field, MappedField][]
		const defaults: Record<Field, { type: Type; display: string }> = {
			name: { type: "text", display: "Name" },
			"name.first": { type: "text", display: "First Name" },
			"name.last": { type: "text", display: "Last Name" },
			title: { type: "text", display: "Title" },
			department: { type: "text", display: "Department" },
			company: { type: "text", display: "Company" },
			phone: { type: "phone", display: "Phone" },
			email: { type: "email", display: "Email" },
		}
		export function toMapping(recipient: Recipient): Mapping {
			const result: Mapping = []
			if (Array.isArray(recipient))
				fields.forEach(field => recipient.includes(field) && result.push([field, defaults[field]]))
			else {
				const keys = Object.keys(recipient)
				fields.forEach(
					field => keys.includes(field) && result.push([field, { ...defaults[field], ...recipient[field] }])
				)
			}
			return result
		}
	}
	export type Mapping = [string, MappedField][]
	export function toMapping(
		addressOrCode: isoly.Address[Address.Code.Type] | Address.Code.Type,
		recipient?: Address.Recipient
	): Mapping {
		let result: Mapping
		const [code, parameter] = Code.is(addressOrCode)
			? [addressOrCode, undefined]
			: [Code.from(addressOrCode.countryCode), addressOrCode]
		switch (code) {
			case "GB":
				result = GB.toMapping(parameter)
				break
			case "SE":
				result = SE.toMapping(parameter)
				break
			case "default":
				result = Default.toMapping(parameter)
				break
			default:
				result = Default.mapping
		}
		return [...(recipient ? Recipient.toMapping(recipient) : []), ...result]
	}
}
