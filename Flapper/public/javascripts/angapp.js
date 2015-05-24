var app = angular.module('flapperNews', ['ui.router']);

app.config(function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('home',{
		url:'/home',
		templateUrl:'/home.html',
		controller:'MainCtrl',
		resolve: {
		    postPromise: ['posts', function(posts){
		      return posts.getAll();
		    }]
		  }
		
	})
	.state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/posts.html',
	  controller: 'PostsCtrl',
	  resolve: {
		    postComments:['$stateParams', 'posts',function($stateParams, posts) {
		      return posts.getComment({id:$stateParams.id});
		    }]
		  }
	});
	
	$urlRouterProvider.otherwise('home');
	
});


app.factory('posts',function($http){
	var o = {
		    posts: []
		  };
		
		  o.comments = [];
		  o.getAll  = function() {
			    return $http.get('/getPost'). success(function(data) { 
			  angular.copy(data,o.posts);	 
		  })
		  };
		  o.savePost = function(post){
			  return $http.post('/savePost',post). success(function(data) {
			 // o.posts.push(data);
				  o.getAll();
		  })
		  };
		  o.upvotePost = function(upvotes){
			 return $http.post('/upvotePost',upvotes).success(function(data){
			 });
		  };
		  o.getComment = function(id){
			  return $http.post('/getComment',id).then(function(res) { 
				 angular.copy(res.data,o.comments);
			   })
		  };
		  o.addComments = function (commentsData){
			  return $http.post('/addComment',commentsData).success(function(){
				o.getComment({id:commentsData.post_id});
			  });
		  };
		  o.upvoteComment = function(upvotes){
				 return $http.post('/upvoteComment',upvotes).success(function(data){
		  });
		  };
	return o;  
	 
});


app.controller('MainCtrl', function($scope,$http,posts){
	$scope.posts = posts.posts ;
	console.log(1 + $scope.posts); 
	
	
	$scope.addPost = function(){
		if(!$scope.title || $scope.title===''){return;}
		posts.savePost({
			title:$scope.title,
			link:$scope.link,
			upvotes:0
		});
		
		$scope.title='';
		$scope.link='';
		
	};
	
	$scope.incrementUpvote = function(post){
		post.upvotes += 1;
		posts.upvotePost({upvotes:post.upvotes,title:post.title,post_id:post.post_id});
	};
	
});




app.controller('PostsCtrl',function($scope,posts){
	$scope.comments = posts.comments;
	$scope.addComment = function(){
		  if($scope.body === '') { return; }
		  posts.addComments({
		    body: $scope.body,
		    author: 'user',
		    post_id:$scope.comments[0].post_id,
		    upvotes: 0
		  });
		  $scope.body = '';
		};
		
		$scope.incrementUpvotes = function(comment){
			comment.comm_upvotes += 1;
			posts.upvoteComment({upvotes:comment.comm_upvotes,comment_id:comment.comment_id});
		};
	
});






  