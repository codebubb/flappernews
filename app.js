var app = angular.module('flappernews', ['ui.router']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
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



app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.test = 'Hello World';
  $scope.posts = posts.posts;
  $scope.addPost = function(){
    if($scope.title){
      $scope.posts.push({title: $scope.title, link: $scope.link, upvotes: 0});
      $scope.title = '';
      $scope.link = '';
    }
  };
  $scope.upVote = function(post){
    post.upvotes +=1;
  };
}]);
