import { Metadata } from "./Metadata"
import { Review } from "./Review"

export interface Root {
	created: number
	d1: string
	d2: string
	dir: string
	files: File[]
	files_count: number
	item_last_updated: number
	item_size: number
	metadata: Metadata
	reviews: Review[]
	server: string
	uniq: number
	workable_servers: string[]
}
