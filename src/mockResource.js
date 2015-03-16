'use strict';

angular.module('mockResource', [])
    .factory('MockResource', ['$q',
        function($q) {

            function MockResource(q) {
                this.$q = q;
            };

            MockResource.prototype.mock = function(obj, method) {
                var deferred = this.$q.defer();
                var value;
                var rejectReason;
                var returnedValue;
                var successCallback, failureCallback;

                if (startsWith$(method)) {
                    mockInstance(getMethodSpy());
                } else {
                    mockClass(getMethodSpy());
                }

                return {
                    resolve: resolve,
                    reject: reject,
                    return: resolve
                };

                function startsWith$(method) {
                    return method.indexOf('$') === 0;
                }

                function getMethodSpy() {
                    var methodSpy;
                    if (!jasmine.isSpy(obj[method])) {
                        methodSpy = spyOn(obj, method);
                    } else {
                        methodSpy = obj[method];
                    }
                    return methodSpy;
                }

                function mockClass(methodSpy) {
                    methodSpy.and.callFake(function(arg, success, failure) {

                        handleCallbacks(success, failure);
                        return window.angular.extend(value, {
                            $promise: deferred.promise
                        });

                    });
                };

                function mockInstance(methodSpy) {
                    methodSpy.and.callFake(function(arg, success, failure) {

                        handleCallbacks(success, failure);
                        return deferred.promise;

                    });
                };

                function handleCallbacks(success, failure) {
                    successCallback = success;
                    failureCallback = failure;

                    if (window.angular.isDefined(returnedValue) && window.angular.isDefined(successCallback)) {
                        successCallback(returnedValue);
                    } else {
                        value = {};
                    }
                    if (window.angular.isDefined(rejectReason && window.angular.isDefined(failureCallback))) {
                        failureCallback(rejectReason);
                    }
                }

                function resolve(resolvedValue) {
                    returnedValue = resolvedValue;
                    value = window.angular.isUndefined(value) ? {} : value;
                    if (!startsWith$(method)) {
                        window.angular.extend(value, resolvedValue);
                    }
                    deferred.resolve(resolvedValue);
                    if (window.angular.isDefined(successCallback)) {
                        successCallback(resolvedValue);
                    }
                };

                function reject(reason) {
                    rejectReason = reason;
                    deferred.reject(reason);
                    if (window.angular.isDefined(failureCallback)) {
                        failureCallback(reason);
                    }
                }

            };

            MockResource.prototype.when = function(obj, method) {
                return this.mock(obj, method);
            }

            return new MockResource($q);
        }
    ]);
