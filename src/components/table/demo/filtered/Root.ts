export interface Root {
	current_page: number
	data: Cat[]
	first_page_url: string
	from: number
	last_page: number
	last_page_url: string
	links: Link[]
	next_page_url: string
	path: string
	per_page: string
	prev_page_url: any
	to: number
	total: number
}

export interface Cat {
	breed: string
	country: string
	origin: string
	coat: string
	pattern: string
	price?: number
	nested?: Cat
}

export interface Link {
	url?: string
	label: string
	active: boolean
}
