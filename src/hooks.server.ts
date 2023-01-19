import { redirect, type Handle } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';
import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken";
import { events } from "oracledb";

interface User {
    username: string,
	auth: boolean,
    iat: number,
    exp: number
}

export const handle = (async ({ event, resolve }) => {
    const jwt = event.cookies.get('jwt');

    if(jwt){
        try{
            let decoded = jsonwebtoken.verify(
                event.cookies.get('jwt') ?? '',
                env.JWTSECRETKEY ?? 'shhsecret'
            ) as User

            event.locals.user = decoded;
        }
        catch(e){
            if(e instanceof TokenExpiredError){
                throw redirect(302, "/login?err=tokenexpired");
            } else {
                console.log(e);
            }
        }
    }

    return resolve(event);
}) satisfies Handle;