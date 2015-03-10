'use strict';

describe('Mock Resource', function() {

    var realObject, spiedObject, spyObject, obj;
    var rootScope;
    var objectTypes, type;
    var MockResource;

    // object types have to be initialize before adding any parameters for tests
    // it enables to use proper name in test description -> it('...')
    // due to usage of spying, it's not possible to create all test parameters here, it has to be done in before() or it()
    objectTypes = {
        'realObject': {
            'desc': 'real object'
        },
        'spiedObject': {
            'desc': 'spied object'
        },
        'spyObject': {
            'desc': 'spy object'
        }
    };

    beforeEach(function() {

        module('mockResource');

        inject(['$injector',
            function($injector) {
                MockResource = $injector.get(
                    'MockResource');
                rootScope = $injector.get('$rootScope');
            }
        ]);

        var realMethod = function() {
            return {};
        }

        realObject = {
            'method': realMethod,
            '$method': realMethod
        };
        spiedObject = {
            'method': realMethod,
            '$method': realMethod
        };

        spyOn(spiedObject, ['method']);
        spyOn(spiedObject, ['$method']);

        spyObject = jasmine.createSpyObj('spyObject', ['method', '$method']);
    });

    // used to parameterize tests - suite should be executed for 3 types of objects
    beforeEach(function() {
        objectTypes.realObject.obj = realObject;
        objectTypes.spiedObject.obj = spiedObject;
        objectTypes.spyObject.obj = spyObject;
    })

    for (type in objectTypes) {
        (function(type) {

            describe('when mocks ' + objectTypes[type].desc + ' with method name NOT STARTING with $', function() {

                var mockMethod;

                beforeEach(function() {
                    obj = objectTypes[type].obj;
                    mockMethod = MockResource.mock(obj,
                        'method');
                });

                it('should return empty object with $promise', function() {

                    var result = obj.method();

                    expect(result.$promise).toBeDefined();

                });

                it('should extend returned object with object passed to resolve', function() {

                    var result = obj.method();

                    expect(result.a).toBeUndefined();

                    mockMethod.resolve({
                        someField: 'someValue'
                    });

                    expect(result.someField).toEqual(
                        'someValue');

                });

                it('should call failure callback on reject', function() {

                    var result = obj.method();
                    var success, failure, error;
                    error = {
                        errorCode: 343
                    };
                    success = jasmine.createSpy('success');
                    failure = jasmine.createSpy('failure');

                    result.$promise.then(success, failure);

                    mockMethod.reject(error);

                    rootScope.$digest();

                    expect(failure).toHaveBeenCalledWith(error);
                    expect(success).not.toHaveBeenCalled();
                });

                it('should call success callback on resolve', function() {

                    var result = obj.method();
                    var success, failure;
                    var resolvedValue = {
                        errorCode: 343
                    };
                    success = jasmine.createSpy('success');
                    failure = jasmine.createSpy('failure');

                    result.$promise.then(success, failure);

                    mockMethod.resolve(resolvedValue);

                    rootScope.$digest();

                    expect(success).toHaveBeenCalledWith(resolvedValue);
                    expect(failure).not.toHaveBeenCalled();
                });

            });

            describe('when mocks ' + objectTypes[type].desc + ' with method name STARTING with $', function() {

                var mockMethod;

                beforeEach(function() {
                    obj = objectTypes[type].obj;
                    mockMethod = MockResource.mock(obj,
                        '$method');
                });

                it('should return $promise', function() {

                    var result = obj.$method();

                    expect(result).toBeDefined();

                });

                it('should call failure callback on reject', function() {

                    var result = obj.$method();
                    var success, failure, error;
                    error = {
                        errorCode: 343
                    };
                    success = jasmine.createSpy('success');
                    failure = jasmine.createSpy('failure');

                    result.then(success, failure);

                    mockMethod.reject(error);

                    rootScope.$digest();

                    expect(failure).toHaveBeenCalledWith(error);
                    expect(success).not.toHaveBeenCalled();
                });

                it('should call success callback on resolve', function() {

                    var result = obj.$method();
                    var success, failure;
                    var resolvedValue = {
                        errorCode: 343
                    };
                    success = jasmine.createSpy('success');
                    failure = jasmine.createSpy('failure');

                    result.then(success, failure);

                    mockMethod.resolve(resolvedValue);

                    rootScope.$digest();

                    expect(success).toHaveBeenCalledWith(resolvedValue);
                    expect(failure).not.toHaveBeenCalled();
                });

            });

        })(type);
    }

});
