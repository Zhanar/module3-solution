(function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      notFound: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.notFound = false;

  menu.search = function() {

    MenuSearchService.getMatchedMenuItems(menu.searchTerm).then(function(result) {
      menu.items = result;
      if(menu.searchTerm === undefined || menu.items.length === 0) {
        menu.notFound = true;
      }
      else {
        menu.notFound = false;
      }
    });
  };

  menu.removeItem = function(itemIndex) {
    MenuSearchService.removeItem(itemIndex);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var foundItems = [];

  service.getMatchedMenuItems = function(searchTerm){

    return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {

      // process result and only keep items that match
      for (var i = 0; i < result.data.menu_items.length; i++) {
        if(result.data.menu_items[i].description.indexOf(searchTerm) !== -1) {
          foundItems.push(result.data.menu_items[i]);
        }
      };
      // return processed items
      return foundItems;
    });
  };
  service.removeItem = function (itemIndex) {
    foundItems.splice(itemIndex, 1);
  };
}

})();
