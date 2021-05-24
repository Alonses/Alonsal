const express = require('express')
const router = express.Router()
const fetch = require('node-fetch');
require('dotenv').config()

const clientID = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET
const port = process.env.PORT

router.get('/api/user', async ({ headers }, res) => {
  console.log('tocou')
	const { code } = headers;
	if (code) {
		try {
			const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientID,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:5000`,
					scope: 'identify',
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await oauthResult.json();
			const userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });
      console.log(oauthData)
      const userJSON = await userResult.json()
      res.send(userJSON)
      console.log(userJSON)
		} catch (error) {
      // NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized res in the try block above
			console.error(error);
		}
	}

})

module.exports =  router