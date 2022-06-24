const express = require('express');
const cors = require('cors');
const Booksdata = require('./src/model/BooksData');
const app = new express();
const crede = require('./src/model/UserData');
const jwt = require('jsonwebtoken');
const path = require('path');
app.use(express.static('./dist/Library'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/api/signup', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Method:GET,POST,PUT,DELETE');
	var userCred = {
		email: req.body.email,
		password: req.body.password
	};
	var userdb = new crede(userCred);
	userdb.save();
	res.send();
});

app.post('/api/login', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Method:GET,POST,PUT,DELETE');
	crede
		.findOne({ email: req.body.email, password: req.body.password }, (err, user) => {
			if (err) {
				console.log('error is', err);
			} else {
				console.log(user);
			}
		})
		.clone()
		.then((user) => {
			if (user !== null) {
				let payload = { subject: user.email + user.password };
				let token = jwt.sign(payload, 'secretKey');
				res.status(200).send({ token });
			} else {
				res.status(401).send('Wrong Credentials');
			}
		});
});
app.get('/api/products', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	Booksdata.find().then(function(products) {
		res.send(products);
	});
});

app.post('/api/insert', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	console.log(req.body);
	var book = {
		title: req.body.item.title,
		image: req.body.item.image,
		author: req.body.item.author,
		about: req.body.item.about,
		rating: req.body.item.rating
	};
	// var product = {
	//     productCode: req.body.productCode,
	//     productName: req.body.productName,
	//     availability: req.body.availability,
	//     price: req.body.price,
	//     rating: req.body.rating,
	//     imageURL: req.body.imageURL
	// }
	console.log('Hello');
	var books = new Booksdata(book);
	books.save();
});
app.get('/api/:id', (req, res) => {
	const id = req.params.id;
	Booksdata.findOne({ _id: id }).then((product) => {
		res.send(product);
	});
});
app.put('/api/update', (req, res) => {
	console.log(req.body);
	(id = req.body._id),
		(productId = req.body.productId),
		(title = req.body.title),
		(author = req.body.author),
		(about = req.body.about),
		(image = req.body.image),
		(rating = req.body.rating);
	Booksdata.findByIdAndUpdate(
		{ _id: id },
		{
			$set: {
				productId: productId,
				title: title,
				author: author,
				about: about,
				image: image,
				rating: rating
			}
		}
	).then(function() {
		res.send();
	});
});

app.delete('/api/remove/:id', (req, res) => {
	id = req.params.id;
	Booksdata.findByIdAndDelete({ _id: id }).then(() => {
		console.log('success');
		res.send();
	});
});

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname + '/dist//Library/index.html'));
});

app.listen(process.env.PORT || 3000, () => {
	console.log('server up in port 3000');
});
