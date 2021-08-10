# RecitaList Server

This is the server for a recital planning application intended to help classical singers of all levels plan recitals and discover repertoire.

Responses follow [JSend](https://github.com/omniti-labs/jsend) documentation

---

## Open Endpoints (No Authorization required)

### `/users/register` - POST - Register a new user

**Request Body**

```json
{
	"user": {
		"email": "user@email.com",
		"password": "NotASecurePassword"
	}
}
```

**Success Response**

```json
{
	"status": "success",
	"data": {
		"email": "user@email.com",
		"token": "AJSONWebToken"
	}
}
```

### `/users/login` - POST - Login an existing user

**Request Body**

```json
{
	"user": {
		"email": "user@email.com",
		"password": "NotASecurePassword"
	}
}
```

**Success Response**

```json
{
	"status": "success",
	"data": {
		"email": "user@email.com",
		"token": "AJSONWebToken"
	}
}
```

### TO BE IMPLEMENTED - `/songs` - GET - Retrieve all songs in the database

-   query params
    -   title
    -   composer
    -   language
    -   offset (default = 0)
    -   limit (default = 20)

**Success Response**

```json
{
	"_path_": "/songs?title=An%20die%20Musik&composer=Schubert",
	"status": "success",
	"data": {
		"count": 1,
		"songs": [
			{
				"id": 1,
				"title": "An die Musik",
				"composer": "Franz Schubert",
				"author": "Franz von Schober",
				"language": "German",
				"compositionYear": 1817,
				"originalKey": "D Major",
				"catalogueNumber": "D547",
				"period": "Romantic",
				"from": null
			}
		]
	}
}
```

---

## User Authorization Required

### `/recitals` - GET - Retrieve all of a user’s recitals

**Success Response**

```json
{
	"status": "success",
	"data": {
		"count": 1,
		"recitals": [
			{
				"id": 1,
				"name": "Sounds of the Sea",
				"date": "2020-02-09",
				"location": "Voxman Recital Hall",
				"description": "Conor Broaders' Master's Recital and last concert before the pandemic"
			}
		]
	}
}
```

### `/recitals` - POST - Create a new recital

**Request Body**

```json
{
	"recital": {
		"name": "Release from Lockdown",
		"description": "My first recital once I can perform again"
	}
}
```

**Success Response**

```json
{
	"status": "success",
	"data": {
		"recital": {
			"id": 2,
			"name": "Release from Lockdown",
			"date": null,
			"location": null,
			"description": "My first recital once I can perform again"
		}
	}
}
```

### `/recitals/:recitalId` - GET - Retrieve specific recital by recitalId

**Success Response**

```json
{
	"_path_": "/recitals/2",
	"status": "success",
	"data": {
		"recital": {
			"id": 2,
			"name": "Release from Lockdown",
			"date": null,
			"location": null,
			"description": "My first recital once I can perform again"
		}
	}
}
```

### `/recitals/:recitalId` - PUT - Replace a recital’s data

**Request Body**

```json
{
	"_path_": "/recitals/2",
	"recital": {
		"name": "Free at Last",
		"date": "2023-06-01",
		"location": "Carnegie Hall",
		"description": "Celebrating the end of the pandemic (hopefully)"
	}
}
```

**Success Response**

```json
{
	"status": "success",
	"data": {
		"recital": {
			"name": "Free at Last",
			"date": "2023-06-01",
			"location": "Carnegie Hall",
			"description": "Celebrating the end of the pandemic (hopefully)"
		}
	}
}
```

### `/recitals/:recitalId` - PATCH - Update a recital’s data

**Request Body**

```json
{
	"_path_": "/recitals/2",
	"recital": {
		"date": "2024-01-01",
		"location": "Civic Opera House"
	}
}
```

**Success Response**

```json
{
	"status": "success",
	"data": {
		"recital": {
			"name": "Free at Last",
			"date": "2024-01-01",
			"location": "Civic Opera House",
			"description": "Celebrating the end of the pandemic (hopefully)"
		}
	}
}
```

### `/recitals/:recitalId` - DELETE - Delete a recital

**Success Response**

```json
{
	"status": "success",
	"data": null
}
```

### TO BE IMPLEMENTED - `/recitals/:recitalId/songs` - GET - Retrieve all songs in a recital

**Success Response**

```json
{}
```

### TO BE IMPLEMENTED - `/recitals/:recitalId/songs` - PUT - Reorder the songs in a recital

**Request Body**

```json
{}
```

**Success Response**

```json
{
	"status": "success",
	"data": {}
}
```

### TO BE IMPLEMENTED - `/recitals/:recitalId/songs/:songId` - POST - Add a song to the end of the recital

**Request Body**

```json
{}
```

**Success Response**

```json
{
	"status": "success",
	"data": {}
}
```

### TO BE IMPLEMENTED - `/recitals/:recitalId/songs/:songId` - DELETE - Remove a specific song from a recital

**Success Response**

```json
{
	"status": "success",
	"data": null
}
```

---

## Admin Authorization Required

### `/admin/songs` - POST - Add a new song

**Request Body**

```json
{
	"song": {
		"title": "An die Musik",
		"composer": "Franz Schubert",
		"author": "Franz von Schober",
		"language": "German",
		"compositionYear": 1817,
		"originalKey": "D Major",
		"catalogueNumber": "D547",
		"period": "Romantic",
		"from": null
	}
}
```

**Success Response**

```json
{
	"status": "success",
	"data": {
		"song": {
			"id": 1,
			"title": "An die Musik",
			"composer": "Franz Schubert",
			"author": "Franz von Schober",
			"language": "German",
			"compositionYear": 1817,
			"originalKey": "D Major",
			"catalogueNumber": "D547",
			"period": "Romantic",
			"from": null
		}
	}
}
```

### `/admin/songs/:songId` - PATCH - Edit a song in the database

**Request Body**

```json
{
	"_path_": "/admin/songs/1",
	"song": {
		"title": "Erlkönig",
		"author": "Johann Goethe",
		"compositionYear": 1815,
		"originalKey": "G Minor",
		"catalogueNumber": "D328"
	}
}
```

**Success Response**

```json
{
	"status": "success",
	"data": {
		"song": {
			"id": 1,
			"title": "Erlkönig",
			"composer": "Franz Schubert",
			"author": "Johann Goethe",
			"language": "German",
			"compositionYear": 1815,
			"originalKey": "G Minor",
			"catalogueNumber": "D328",
			"period": "Romantic",
			"from": null
		}
	}
}
```

### `/admin/songs/:songId` - DELETE - Delete a song from the database

**Success Response**

```json
{
	"status": "success",
	"data": null
}
```

### TO BE IMPLEMENTED - `/admin/users` - GET - Retrieve all registered users

**Success Response**

```json
{
	"status": "success",
	"data": {}
}
```

### TO BE IMPLEMENTED - `/admin/users/:userId` - PATCH - Update a user's email or password

**Request Body**

```json
{}
```

**Success Response**

```json
{
	"status": "success",
	"data": {}
}
```

### TO BE IMPLEMENTED - `/admin/users/:userId` - DELETE - Delete a user's account

**Success Response**

```json
{
	"status": "success",
	"data": null
}
```
