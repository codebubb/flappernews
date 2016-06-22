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
        controller: 'MainCtrl'
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/post.html',
        controller: 'PostsCtrl'
      });
    $urlRouterProvider.otherwise('home');
  }
]);

app.factory('posts', [function(){
  var data = {
    posts: []
  };
  return data;
}]);

/**
  Controllers
  -----------
*/

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.test = 'Hello World';
  $scope.posts = posts.posts;
  $scope.addPost = function(){
    if($scope.title){
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          {author: 'Joe', body: 'Cool post!', upvotes: 0},
          {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
        ]
      });
      $scope.title = '';
      $scope.link = '';
    }
  };
  $scope.upVote = function(post){
    post.upvotes +=1;
  };
}]);

app.controller('PostsCtrl', ['$scope', 'posts', '$stateParams', function($scope, posts, $stateParams){
  console.log($stateParams.id);
  $scope.post = posts.posts[$stateParams.id];
  $scope.addComment = function(){
    if($scope.body){
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    }
  };
}]);
