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
      })
      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('home');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('home');
          }
        }]
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
    var token = auth.getToken();
    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else{
      return false;
    }
  };
  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
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

app.factory('posts', ['$http', 'auth', function($http, auth){
  var data = {
    posts: []
  };
  // console.log("Token: " + auth.getToken());
  var tokenHeader = {
    headers: {Authorization: 'Bearer ' + auth.getToken()}
  };
  data.getAll = function(){
    return $http.get('/posts').success(function(result){
      angular.copy(result, data.posts);
    });
  };

  data.get = function(id){
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };

  data.create = function(post){
    return $http.post('/posts', post, tokenHeader).success(function(result){
      data.posts.push(result);
    });
  };

  data.upvote = function(post){
    return $http.put('/posts/' + post._id + '/upvote', null, tokenHeader)
      .success(function(result){
        post.upvotes = result.upvotes;
      });
  };

  data.addComment = function(id, comment){
    console.log("Adding comment...");
    return $http.post('/posts/' + id + '/comments', comment, tokenHeader);
  };

  data.upvoteComment = function(post, comment){
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote',null, tokenHeader)
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

app.controller('MainCtrl', ['$scope', 'posts', 'auth', function($scope, posts, auth){
  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.addPost = function(){
    if($scope.title){
      posts.create({
        title: $scope.title,
        link: $scope.link
        // author: auth.currentUser
      });
      $scope.title = '';
      $scope.link = '';
    }
  };
  $scope.upVote = function(post){
    posts.upvote(post);
  };
}]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth', function($scope, posts, post, auth){
  $scope.post = post;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.upvoteComment = function(comment){


    posts.upvoteComment(post, comment);
  };
  $scope.addComment = function(){
    console.log("Adding comment (CTRL);");
    if($scope.body){
      posts.addComment(post._id, {
        body: $scope.body,
        author: auth.currentUser,
      }).success(function(comment){
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    }

  };

}]);

app.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){
  $scope.user = {};
  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.login($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

}]);

app.controller('NavCtrl', ['$scope', 'auth', function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logout;
}]);
