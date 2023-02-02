import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import jsonwebtoken from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export const load = (async ({ locals }) => {
	return {
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async (event: RequestEvent) => {
		const data = await event.request.formData();
		const uniqname = data.get('uniqname');
		const password = data.get('password');
		const redirectUrl = data.get('redirect');

		let userdata = await event.fetch('https://slidetracker.med.umich.edu/trylogin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: '{"uniqname":"' + uniqname + '","password":"' + password + '"}'
		});

		if ((await userdata.text()) === 'no') {
			return fail(401, { message: 'Invalid username or password.' });
		}

		var token = jsonwebtoken.sign(
			{ username: uniqname, auth: true },
			env.JWTSECRETKEY ?? 'shhsecret',
			{ expiresIn: '8h' }
		);

		event.cookies.set('jwt', token, { path: '/', secure: false });
		console.log('User ' + uniqname + ' logged in.');

		if (redirectUrl && redirectUrl !== 'null') {
			throw redirect(302, redirectUrl as string);
		}

		throw redirect(302, '/');
	},

	scanLogin: async (event: RequestEvent) => {
		const data = await event.request.formData();

		const uniqname = data.get('uniqname');
		var token = jsonwebtoken.sign(
			{ username: uniqname, auth: false },
			env.JWTSECRETKEY ?? 'shhsecret',
			{ expiresIn: '8h' }
		);

		event.cookies.set('jwt', token, { path: '/', secure: false });
		console.log('Scan login ' + uniqname + ' logged in.');
	},

	logout: async (event: RequestEvent) => {
		console.log('User ' + event.locals.user?.username + ' logged out.');
		event.cookies.delete('jwt');
		event.locals.user = null;

		return { success: true };
	}
};
