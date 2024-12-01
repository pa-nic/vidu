import { redirect } from '@sveltejs/kit'

export const actions = {
    default({ cookies }) {
        // eat the cookie
        cookies.set('nf_jwt', '', {
            path: '/',
            expires: new Date(0),
        })

        // redirect the user
        redirect(302, '/')
    },
}