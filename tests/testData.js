module.exports = {
	users: {
		validUser1: {
			email: 'test@email.com',
			password: 'thisIsAPassword',
		},
		validUser2: {
			email: 'test2@email.com',
			password: 'ThisIsAlsoAPassword',
		},
		adminUser: {
			email: 'admin@email.com',
			password: 'AdminPassword',
		},
		incorrectEmail: {
			email: 'jest@email.com',
			password: 'thisIsAPassword',
		},
		incorrectPassword: {
			email: 'test@email.com',
			password: 'thisIsNotAPassword',
		},
		missingEmail: {
			password: 'thisIsAPassword',
		},
		missingPassword: {
			email: 'test1@email.com',
		},
	},
	recitals: {
		validRecital: {
			name: 'Test Recital',
			date: '2021-09-01',
			location: 'Test Location',
			description: 'I am but a humble test',
		},
		missingRecitalName: {
			date: '2021-09-01',
			location: 'Test Location',
			description: "I am bad request. Don't use me",
		},
		replacementRecital: {
			name: 'Another Recital',
			date: '2021-12-01',
			location: 'Somewhere',
			description: 'We had to change the recital',
		},
		patchRecital: {
			date: '2021-09-05',
			description: 'We only had to change the date',
		},
		emptyRecital: {},
	},
	songs: {
		validSong: {
			title: 'An die Musik',
			composer: 'Franz Schubert',
			author: 'Franz von Schober',
			language: 'German',
			composition_year: 1817,
			original_key: 'D Major',
			catalogue_number: 'D547',
			period: 'Romantic',
		},
		validSongWithSet: {
			title: 'Gute Nacht',
			composer: 'Franz Schubert',
			author: 'Wilhelm Müller',
			language: 'German',
			composition_year: 1827,
			original_key: 'D minor',
			catalogue_number: 'D795',
			period: 'Romantic',
			from: 'Winterreise',
		},
		missingTitle: {
			composer: 'Franz Schubert',
			author: 'Wilhelm Müller',
			language: 'German',
			composition_year: 1827,
			original_key: 'D minor',
			catalogue_number: 'D795',
			period: 'Romantic',
			from: 'Winterreise',
		},
		patchSong: {
			title: 'Du bist die Ruh',
			author: 'Friedrich Rückert',
			composition_year: 1823,
			original_key: 'E-flat major',
			catalogue_number: 'D776',
		},
	},
};
