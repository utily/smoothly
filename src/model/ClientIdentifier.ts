import { Identifier } from "authly"

export abstract class ClientIdentifier {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}
	private static valueCache?: string
	static get value(): string {
		ClientIdentifier.valueCache = localStorage.getItem("clientIdentifier") || undefined
		if (!ClientIdentifier.valueCache) {
			ClientIdentifier.valueCache = Identifier.generate(12)
			localStorage.setItem("clientIdentifier", ClientIdentifier.valueCache)
		}
		return ClientIdentifier.valueCache
	}
}
