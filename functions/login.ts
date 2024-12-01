export async function handler(event) {
    const formData = new URLSearchParams (event.body);
    const email = formData.get("email")?.toString() ?? '';
    const password = formData.get("password")?.toString() ?? '';

    const endpoint = `${process.env.URL}/.netlify/identity/token`;

    const data = new URLSearchParams();
            data.append('grant_type', 'password');
            data.append('username', email);
            data.append('password', password);
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    try {
        const response = await fetch(`${process.env.URL}/.netlify/identity/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
        const access_token  = (await response.json()).access_token;

        return {
            statusCode: 302,
            headers: {
                'Set-Cookie': `nf_jwt=${access_token}; Path=/; HttpOnly; Secure`,
                'Cache-Control': 'no-cache',
                Location: '/stats/',
            },
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 302,
            headers: {
                'Cache-Control': 'no-cache',
                Location: '/',
            },
        };
    }
};