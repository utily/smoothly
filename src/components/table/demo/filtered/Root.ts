import { Metadata } from "./Metadata"
import { Review } from "./Review"

export interface Root {
	created: number
	d1: string
	d2: string
	dir: string
	files: File[]
	filesCount: number
	itemLastUpdated: number
	itemSize: number
	metadata: Metadata
	reviews: Review[]
	server: string
	uniq: number
	workableServers: string[]
}
