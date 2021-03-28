const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const sqlite = require('sqlite3').verbose()
const frontend = express.static('frontend/dist/frontend')

const app = express()
const db = new sqlite.Database('./recipes.db')

db.run("CREATE TABLE IF NOT EXISTS recipe (title TEXT UNIQUE NOT NULL, ingredients TEXT NOT NULL, directions TEXT)");

app.use(bodyParser.json())
app.use('/', frontend)

app.get('/hello', function(req, res){
	res.send(JSON.stringify("Hello, world!"))
})

app.post('/hello', function(req, res){
	var name = 'Hello, ' + String(req.body.firstName) + '!'
	res.send(JSON.stringify(name))
})

app.post('/createNewRecipe', function(req, res){
	db.run('INSERT INTO recipe(title, ingredients) VALUES (?, ?)', [req.body.title, req.body.ingredients], (err) => {
		if(err){
			res.send(err)
		} else {
			let response = `Inserted recipe into database.\nTitle: ${req.body.title}\nIngredients: ${req.body.ingredients}\nDirections: ${req.body.directions}`
			res.send(JSON.stringify(response))
		}
	})
})

app.use('*', express.static('frontend/dist/frontend/index.html'))

app.listen(3000, () => {
	console.log('Example app listening at port 3000.')
})
