

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var connection = mysql.createConnection({
	host :'localhost',
	user :'root',
	password : 'toor',
	database: 'flapper'
});


app.get('/getPost',function(req,res){
	connection.query('select post_id,title, link, upvotes from posts;',function(err,rows){
		if(!err){
			console.log("You are connected to the database."  + rows);
			res.send(rows);
	        }
	        else{
	          throw err;  
	        }
	}); 
});

app.post('/savePost',function(req,res){
	title = req.body.title;
	link = req.body.link;
	upvotes = req.body.upvotes;
	console.log('insert into posts (title,link,upvotes) values ("'+title+'","'+link+'","'+upvotes+'")')
	connection.query('insert into posts (title,link,upvotes) values ("'+title+'","'+link+'","'+upvotes+'")' ,function(err,results){
		if(!err){
			res.send(req.body);
	        }
	        else{
	          throw err;   
	        }
	}); 
});


app.post('/upvotePost',function(req,res){
	upvotePost = req.body.upvotes;
	title = req.body.title;
	post_id= req.body.post_id;
	console.log('update posts set upvotes = "'+upvotePost+'" where post_id = "'+post_id+'"');
	connection.query('update posts set upvotes = "'+upvotePost+'" where post_id = "'+post_id+'"' ,function(err,results){
		if(!err){
			res.send(req.body);
	        }
	        else{
	          throw err;   
	        }
	}); 
});

app.post('/getComment',function(req,res){
	id=req.body.id;
	connection.query('select * from posts left join comments on posts.post_id=comments.comm_post_id where posts.post_id="'+id+'";',function(err,rows){
		if(!err){
			console.log("You are connected to the database."  + rows);
			res.send(rows);
	        }
	        else{
	          throw err;  
	        }
	}); 
});

app.post('/addComment',function(req,res){
	post_id = req.body.post_id;
	body = req.body.body;
	author = req.body.author;
	upvotes = req.body.upvotes;
	connection.query('insert into comments (comm_post_id,body,author,comm_upvotes) values ("'+post_id+'","'+body+'","'+author+'","'+upvotes+'")' ,function(err,results){
		if(!err){
			res.send("");
	        }
	        else{
	          throw err;   
	        }
	}); 
});

app.post('/upvoteComment',function(req,res){
	upvotePost = req.body.upvotes;
	comment_id= req.body.comment_id;
	console.log('update comments set comm_upvotes = "'+upvotePost+'" where comment_id = "'+comment_id+'"');
	connection.query('update comments set comm_upvotes = "'+upvotePost+'" where comment_id = "'+comment_id+'"' ,function(err,results){
		if(!err){
			res.send("");
	        }
	        else{
	          throw err;   
	        } 
	}); 
});
