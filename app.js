var app = angular.module('flappernews', []);
app.controller('MainCtrl', ['$scope', function($scope){
  $scope.test = 'Hello World';
  $scope.posts = [
    {title: 'post1', upvotes: 35},
    {title: 'post2', upvotes: 2},
    {title: 'post3', upvotes: 44},
    {title: 'post4', upvotes: 12},
    {title: 'post5', upvotes: 7}

  ];
}]);
