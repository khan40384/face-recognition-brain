const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
var knex = require('knex');

const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '687526sk',
    database : 'smart-brain'
  }
});

const app = express();

const database={
	users: [
	{
		id: '123',
		name: 'salman',
		email: 'khan40384@gmail.com',
		password: '687526sk',
		entries: 0,
		joined: new Date(),
    },
    {
		id: '124',
		name: 'muskan',
		email: 'muskan@gmail.com',
		password: 'love123',
		entries: 0,
		joined: new Date(),
    }
  ],
  login: [
  {
  	id: '987',
  	hash: '',
  	email: 'khan40384@gmail.com'
  }
  ]
}


app.use(bodyParser.json());
app.use(cors());
app.get('/profile/:id', (req,res) => {
	const{id}= req.params;
	db.select('*').from('users').where({id})
	.then(user=>{
		if(user.length){
			res.json(user[0])
		}else{
			res.status(400).json('not found')
		}
	})
	.catch(err=>{
		res.status(400).json('error getting user')
	})
})

app.put('/image', (req,res) => {
	const{id}= req.body;
	return db('users').where('id', '=', id)
	.increment('entries',1)
	.returning('*')
	.then(data=>{
		res.json(data[0]);
     })
	.catch(err=>{
		res.status(400).json('unable to get entries')
	})
})

app.get('/', (req,res) => {
	res.send(database.users);
})

app.post('/register', (req,res) => {
	const{name, email, password}= req.body;
	const hash= bcrypt.hashSync(password);
	return db.transaction(trx=>{
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail=>{
		db('users')
	.returning('*')
	.insert({
		name: name,
		email: loginEmail[0],
		joined: new Date()
	}).then(user=>{
		res.json(user[0]);
	})	
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	
	.catch(err=>{
		res.status(400).json('unable to register')
	})
	
})

app.post('/signin', (req,res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data=>{
		console.log(data[0]);
		const isValid=bcrypt.compareSync(req.body.password, data[0].hash);
		if(isValid){
			return db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user=>{
				res.json(user[0]);
			})
			.catch(err=>{
				res.status(400).json('unable to get user')
			})
		}else{
				res.status(400).json('wrong information')
			}
	})
	.catch(err=>{
		res.status(400).json('wrong information')
	})
})

app.listen(3000, ()=>{
	console.log('app is running at port 3000');
})

