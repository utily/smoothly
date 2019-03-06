export interface CardIssuer {
	name: string
	verification: RegExp
	identification: RegExp
	length: number
	icon: string
}
