var app = angular.module('flappernews', ['ui.router']);

/**
  Routing
  -------
*/

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
        }
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/post.html',
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts){
            return posts.get($stateParams.id);
          }]
        }
      });
    $urlRouterProvider.otherwise('home');
  }
]);

/**
  Services
  --------
*/

app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};
  auth.saveToken = function(token){
    $window.localStorage['flapper-news-token'] = token;
  };
  auth.getToken = function(){
    return $window.localStorage['flapper-news-token'];
  };
  auth.isLoggedIn = function(){
    var token = auth.getToken;
    if(token){
      var payload = JSON.parse($window.atob(token.split('.'[1])));
      return payload.exp > Date.now() / 1000;
    } else{
      return false;
    }
  };
  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($windo.atob(token.split('.')[1]));
      return payload.username;
    }
  };
  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.login = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logout = function(){
    $window.localStorage.removeItem('flapper-news-token');
  };
  return auth;
}]);

app.factory('posts', ['$http', function($http){
  var data = {
    posts: []
  };
  data.getAll = function(){
    console.log("GetAll");
    return $http.get('/posts').success(function(result){
      console.log(result);
      angular.copy(result, data.posts);
    });
  };

  data.get = function(id){
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };

  data.create = function(post){
    return $http.post('/posts', post).success(function(result){
      data.posts.push(result);
    });
  };

  data.upvote = function(post){
    return $http.put('/posts/' + post._id + '/upvote')
      .success(function(result){
        post.upvotes = result.upvotes;
      });
  };

  data.addComment = function(id, comment){
    return $http.post('/posts/' + id + '/comments', comment);
  };

  data.upvoteComment = function(post, comment){
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
      .success(function(result){
        comment.upvotes +=1;
      });
  };


  return data;
}]);

/**
  Controllers
  -----------
*/

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.posts = posts.posts;
  $scope.addPost = function(){
    if($scope.title){
      posts.create({
        title: $scope.title,
        link: $scope.link
      });
      $scope.title = '';
      $scope.link = '';
    }
  };
  $scope.upVote = function(post){
    posts.upvote(post);
  };
}]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', function($scope, posts, post){
  $scope.post = post;
  $scope.upvoteComment = function(comment){
    console.log(post);
    console.log(comment);

  posts.upvoteComment(post, comment);
  $scope.addComment = function(){
    if($scope.body){
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment){
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    }

  };
  };
}]);
