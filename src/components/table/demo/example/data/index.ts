export interface RootObject {
	meta: Meta
	objects: Senator[]
}

export interface Senator {
	caucus?: string
	congress_numbers: number[]
	current: boolean
	description: string
	district?: any
	enddate: string
	extra: Extra
	leadership_title?: string
	party: string
	person: Person
	phone: string
	role_type: string
	role_type_label: string
	senator_class: string
	senator_class_label: string
	senator_rank: string
	senator_rank_label: string
	startdate: string
	state: string
	title: string
	title_long: string
	website: string
}

export interface Person {
	bioguideid: string
	birthday: string
	cspanid?: number
	firstname: string
	gender: string
	gender_label: string
	lastname: string
	link: string
	middlename: string
	name: string
	namemod: string
	nickname: string
	osid: string
	pvsid?: string
	sortname: string
	twitterid?: string
	youtubeid?: string
}

export interface Extra {
	address: string
	contact_form: string
	fax?: string
	office: string
	rss_url?: string
	how?: string
}

export interface Meta {
	limit: number
	offset: number
	total_count: number
}
