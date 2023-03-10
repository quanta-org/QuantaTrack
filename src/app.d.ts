// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface User {
		username: string;
		auth: boolean;
		iat: number;
		exp: number;
	}

	// interface Error {}
	interface Locals {
		user: User | null;
	}
	// interface PageData {}
	// interface Platform {}
}
