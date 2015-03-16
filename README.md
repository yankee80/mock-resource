# mock-resource
testing utils for unit testing angular components using $resource with jasmine

### easy $resource mocking in jasmine tests

Usage of MockResource allows to increase readability of test code if you would like to mock $resource in your jasmine tests. Writing even very simple test requires a lot of noisy code:

```javascript
var resourceSaveResult = {};

var saveCall = jasmine.spy(resource,['save']);
var deferred;

saveCall.save.and.callFake(function() {
    deferred = $q.defer();
    return deferred.promise;
});

deferred.resolve(resourceSaveResult);
```
With MockResource it can be easily replaced with:

```javascript
var resourceSaveResult = {};

var saveCall = MockResource.mock(resource, 'save');

saveCall.resolve(resourceSaveResult);
```
To enable MockResource in your jasmine test you have to initialize 'mockResource' module. Then you can get instance of MockResource to use in your tests.
```javascript
beforeEach(function() {

    module('mockResource');

    inject(['$injector',
        function($injector) {
            MockResource = $injector.get('MockResource');
        }
    ]);
}
```

Remember, if you would like to fire success/failure promise callbacks you should fire $digest

```javascript
$scope.$digest();
```
Installing MockResource:
```
bower install mock-resource
```
