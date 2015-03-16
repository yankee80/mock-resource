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

                var mockMethod, success, failure, error, resolvedValue, args;

                beforeEach(function() {
                    obj = objectTypes[type].obj;
                    mockMethod = MockResource.mock(obj,
                        'method');
                    error = {
                        errorCode: 343
                    };
                    resolvedValue = {
                        value: 4536
                    };
                    success = jasmine.createSpy('success');
                    failure = jasmine.createSpy('failure');
                    args = {};
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

                it('should NOT call failure callback before calling reject', function() {

                    obj.method(args, success, failure);

                    rootScope.$digest();

                    expect(failure).not.toHaveBeenCalled();
                    expect(success).not.toHaveBeenCalled();

                });

                it('should call failure callback after calling reject', function() {

                    obj.method(args, success, failure);

                    mockMethod.reject(error);

                    rootScope.$digest();

                    expect(failure).toHaveBeenCalledWith(error);
                    expect(success).not.toHaveBeenCalled();

                });

                it('should call failure callback after calling mocked method, even if reject was called before mocked method', function() {

                    mockMethod.reject(error);

                    obj.method(args, success, failure);

                    rootScope.$digest();

                    expect(failure).toHaveBeenCalledWith(error);
                    expect(success).not.toHaveBeenCalled();
                });

                it('should NOT call failure callback after calling reject, but before call of mocked method', function() {

                    mockMethod.reject(error);

                    rootScope.$digest();

                    expect(failure).not.toHaveBeenCalled();
                    expect(success).not.toHaveBeenCalled();

                    obj.method(args, success, failure);

                });

                it('should call success callback on resolve', function() {

                    obj.method(args, success, failure);

                    mockMethod.resolve(resolvedValue);

                    rootScope.$digest();

                    expect(success).toHaveBeenCalledWith(resolvedValue);
                    expect(failure).not.toHaveBeenCalled();
                });

                it('should NOT call success callback before calling resolve', function() {

                    obj.method(args, success, failure);

                    rootScope.$digest();

                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();

                });

                it('should call success callback after calling mocked method, even if resolve was called before mocked method', function() {

                    mockMethod.resolve(resolvedValue);

                    obj.method(args, success, failure);

                    rootScope.$digest();

                    expect(success).toHaveBeenCalledWith(resolvedValue);
                    expect(failure).not.toHaveBeenCalled();
                });

                it('should NOT call success callback after calling resolve, but before call of mocked method', function() {

                    mockMethod.resolve(resolvedValue);

                    rootScope.$digest();

                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();

                });

            });

            describe('when mocks ' + objectTypes[type].desc + ' with method name STARTING with $', function() {

                var mockMethod, success, failure, error, resolvedValue, args;

                beforeEach(function() {
                    obj = objectTypes[type].obj;
                    mockMethod = MockResource.mock(obj,
                        '$method');
                    error = {
                        errorCode: 343
                    };
                    resolvedValue = {
                        value: 4536
                    };
                    success = jasmine.createSpy('success');
                    failure = jasmine.createSpy('failure');
                    args = {};
                });

                it('should return $promise', function() {

                    var result = obj.$method();

                    expect(result).toBeDefined();

                });

                it('should NOT call failure callback before calling reject', function() {

                    obj.$method(args, success, failure);

                    rootScope.$digest();

                    expect(failure).not.toHaveBeenCalled();
                    expect(success).not.toHaveBeenCalled();

                });

                it('should call failure callback after calling reject', function() {

                    obj.$method(args, success, failure);

                    mockMethod.reject(error);

                    rootScope.$digest();

                    expect(failure).toHaveBeenCalledWith(error);
                    expect(success).not.toHaveBeenCalled();

                });

                it('should call failure callback after calling mocked method, even if reject was called before mocked method', function() {

                    mockMethod.reject(error);

                    obj.$method(args, success, failure);

                    rootScope.$digest();

                    expect(failure).toHaveBeenCalledWith(error);
                    expect(success).not.toHaveBeenCalled();
                });

                it('should NOT call failure callback after calling reject, but before call of mocked method', function() {

                    mockMethod.reject(error);

                    rootScope.$digest();

                    expect(failure).not.toHaveBeenCalled();
                    expect(success).not.toHaveBeenCalled();

                    obj.$method(args, success, failure);

                });

                it('should call success callback on resolve', function() {

                    obj.$method(args, success, failure);

                    mockMethod.resolve(resolvedValue);

                    rootScope.$digest();

                    expect(success).toHaveBeenCalledWith(resolvedValue);
                    expect(failure).not.toHaveBeenCalled();
                });

                it('should NOT call success callback before calling resolve', function() {

                    obj.$method(args, success, failure);

                    rootScope.$digest();

                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();

                });

                it('should call success callback after calling mocked method, even if resolve was called before mocked method', function() {

                    mockMethod.resolve(resolvedValue);

                    obj.$method(args, success, failure);

                    rootScope.$digest();

                    expect(success).toHaveBeenCalledWith(resolvedValue);
                    expect(failure).not.toHaveBeenCalled();
                });

                it('should NOT call success callback after calling resolve, but before call of mocked method', function() {

                    mockMethod.resolve(resolvedValue);

                    rootScope.$digest();

                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();

                });

            });

        })(type);
    }

});
