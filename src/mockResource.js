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

                if (startsWith$(method)) {
                    mockInstance(getMethodSpy());
                } else {
                    mockClass(getMethodSpy());
                }

                return {
                    resolve: resolve,
                    reject: reject
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
                    methodSpy.and.callFake(function() {
                        value = window.angular.isUndefined(value) ? {} : value;
                        return window.angular.extend(value, {
                            $promise: deferred.promise
                        });
                    });
                };

                function mockInstance(methodSpy) {
                    methodSpy.and.callFake(function() {
                        return deferred.promise;
                    });
                }

                function resolve(resolvedValue) {
                    if(!startsWith$(method)){
                        window.angular.extend(value, resolvedValue);
                    }
                    deferred.resolve(resolvedValue);
                };

                function reject(reason) {
                    rejectReason = reason;
                    deferred.reject(reason);
                }

            };

            return new MockResource($q);
        }
    ]);
