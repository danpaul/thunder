//npm install to insall packages

var express = require('express');
var textNilExpress = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var textNilPostSchema = ({title: String, text: String});
var textNilPost = mongoose.model('Post', textNilPostSchema);

var tp1 = new textNilPost({ text: 'congue lacinia dui, a porttitor lectus' });

tp1.save(function (err) {
  if (err) // ...
  console.log('meow');
});

textNilExpress.use(express.bodyParser());

textNilExpress.locals.title = 'textNIL'
textNilExpress.set('views', __dirname + '/views')
textNilExpress.set('view engine', 'jade')
textNilExpress.use(express.static(__dirname + '/public'))

// textNilExpress.post('/api/post', function (req, res) {
	// var newPost = new textNilPost(req.body);
	// newPost.save(function(error) {
		// if(error){
			// console.log("error saving post");
		// }else{
			// console.log("success");
		// }
	// })
	// //console.log(req.body);
	// res.send(200);
// })

textNilExpress.get('*', function (req, res) {
  res.send('test');
})

// textNilExpress.get('/index*', function (req, res) {
  // res.render('index');
// })

textNilExpress.listen(3000);