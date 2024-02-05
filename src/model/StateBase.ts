import { HasListenable, Listenable, WithListenable } from "./Listenable"

export abstract class StateBase<T extends StateBase<any, any>, C = undefined> implements HasListenable<T> {
	public readonly listenable = new Listenable() as WithListenable<T>
	protected readonly client: C
	// 2 different signatures depending on if C i set to a type.
	protected constructor(...parameters: C extends undefined ? [] : [client: C]) {
		this.client = parameters.length == 1 ? parameters[0] : (undefined as C)
	}
}
