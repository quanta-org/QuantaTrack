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

	interface Parcel {
		uniqname: string,
		workstation: string,
		carrier?: string,
		trackingNumber: string,
		date?: date,
		kitID?: string,
		
		// Optional sending data
		client?: string,
		kitType?: string,

		// Optional receiving data
		routingLocation?: string,

		// Optional opening data
		TCDI?: string,
	}

	// interface Error {}
	interface Locals {
		user: User | null;
	}
	// interface PageData {}
	// interface Platform {}
}
