const rp = require('request-promise');
const readline = require('readline-promise').default;

const rlp = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true,
});

(async () => {
	const token = await rlp.questionAsync('Token: ');

	console.log('Disabling auth...');

	const res = await rp({
		uri: 'https://discordapp.com/api/v6/users/@me/relationships',
		method: 'POST',
		headers: {
			Authorization: token,
			'User-Agent': 'discordbot',
		},
		body: {
			username: 'Deleted User ff1a9125',
			discriminator: 190,
		},
		json: true,
		simple: false,
		resolveWithFullResponse: true,
	});

	if (res.body == '401: Unauthorized') {
		console.log('Invalid token. Exiting...');
		return process.exit();
	}

	console.log('2FA removed and email unverified.');

	if ((await rlp.questionAsync('Change email? (must have password) [Y, N]: ')).toLowerCase() == 'y') {
		const userInfo = await rp({
			uri: 'https://discordapp.com/api/v6/users/@me',
			method: 'GET',
			headers: {
				Authorization: token,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
			},
		});

		const newEmail = await rlp.questionAsync('New Email: ');
		const password = await rlp.questionAsync('Password: ');

		let newPassword = null;

		if ((await rlp.questionAsync('Change password? [Y, N]: ')).toLowerCase() == 'y') newPassword = await rlp.questionAsync('New Password: ');

		const res = await rp({
			uri: 'https://discordapp.com/api/v6/users/@me',
			method: 'PATCH',
			headers: {
				Authorization: token,
				'User-Agent': 'discordbot',
			},
			body: {
				username: userInfo.username,
				password,
				discriminator: null,
				email: newEmail,
				new_password: newPassword,
				avatar: userInfo.avatar,
			},
			json: true,
			simple: false,
			resolveWithFullResponse: true,
		});

		if (res.statusCode != 200) console.log('An error occured, make sure that the new email is not already registered, and that the password is valid. Then, try again.');
		else console.log('Success.');
	}

	process.exit();
})();
