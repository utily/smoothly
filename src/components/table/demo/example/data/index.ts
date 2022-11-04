export interface Programs {
	copyright: string
	programs: Program[]
	pagination: Pagination
}

export interface Pagination {
	page: number
	size: number
	totalhits: number
	totalpages: number
	nextpage: string
}

export interface Program {
	description: string
	email: string
	phone: string
	programurl: string
	programslug: string
	programimage: string
	programimagetemplate: string
	programimagewide: string
	programimagetemplatewide: string
	socialimage: string
	socialimagetemplate: string
	socialmediaplatforms: Socialmediaplatform[]
	channel: Channel
	archived: boolean
	hasondemand: boolean
	haspod: boolean
	responsibleeditor: string
	id: number
	name: string
	broadcastinfo?: string
	programcategory?: Channel
}

export interface Channel {
	id: number
	name: string
}

export interface Socialmediaplatform {
	platform: string
	platformurl: string
}
