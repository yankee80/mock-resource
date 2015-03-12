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

Remember, in both cases if you would like to fire success/failure promise callbacks you should fire $digest

```javascript
$scope.$digest();
```
