// JavaScript Document
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Bodyparser Middleware
app.use(bodyParser.urlencoded({extended: true}));

//Signup Route
app.post('/signup', (req,res)=>{
	const {firstName, lastName, email}= req.body;
	
	//Make sure fields are filled
	if(!firstName || !lastName || !email){
		res.redirect('/fail.html');
		return;
	}
	
	//Construct request data
	const data = {
		members: [
			{
				email_address: email,
				status : 'subscribed',
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	};
	
	const postData = JSON.stringify(data);
	
	const options = {
		url:'https://us19.api.mailchimp.com/3.0/lists/98c28036f9',
		method: 'POST',
		headers:{
			Authorization:'auth 9aa01280e930f7d2faabea8e5969bb6c-us19'
		},
		body: postData
	};
	
	request(options, (err, response, body) => {
		if(err){
			res.redirect('/fail.html');
		} else {
			if(response.statusCode === 200){
				res.redirect('/success.html');
			} else {
				res.redirect('/fail.html');
			}
		}
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));