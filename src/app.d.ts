// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
interface User {
    username: string,
	auth: boolean,
    iat: number,
    exp: number
}

declare namespace App {
	// interface Error {}
	interface Locals {
		user: User|null
	}
	// interface PageData {}
	// interface Platform {}
}