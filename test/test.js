/*eslint-env mocha*/
var System = require('jspm');
var assert = require('assert');

var promise = System.import('test/es6-test-setup').catch(function(e) {
    describe('JSPM', function() {
        it('ES6 module not loaded properly', function() {
            assert.fail(null, '', e);
        });
    });
});

describe('Private methods', function() {
    describe('#_getChannels', function() {
        it('string events should splitted by spaces and comas in channels', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                var result = dummyObject._getChannels('change');

                assert.equal(result.length, 1);
                assert.equal(result[0], 'change');

                result = dummyObject._getChannels('test, change');

                assert.equal(result.length, 2);
                assert.equal(result[0], 'test');
                assert.equal(result[1], 'change');

                result = dummyObject._getChannels('test change');

                assert.equal(result.length, 2);
                assert.equal(result[0], 'test');
                assert.equal(result[1], 'change');

                result = dummyObject._getChannels('  test2 change2,  change3');

                assert.equal(result.length, 3);
                assert.equal(result[0], 'test2');
                assert.equal(result[1], 'change2');
                assert.equal(result[2], 'change3');
                done();
            });

        });

        it('namespaces should be extracted from channels', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                var result = dummyObject._getNameSpaces('change');

                assert.equal(result.length, 1);
                assert.equal(result[0], 'change');

                result = dummyObject._getNameSpaces('change:test');

                assert.equal(result.length, 2);
                assert.equal(result[0], 'change:test');
                assert.equal(result[1], 'change');

                result = dummyObject._getNameSpaces(' change:test2 ');

                assert.equal(result.length, 2);
                assert.equal(result[0], 'change:test2');
                assert.equal(result[1], 'change');

                result = dummyObject._getNameSpaces(' change:test2:attribute');

                assert.equal(result.length, 3);
                assert.equal(result[0], 'change:test2:attribute');
                assert.equal(result[1], 'change:test2');
                assert.equal(result[2], 'change');
                done();
            });

        });
    });
});


describe('Simple trigger', function() {
    describe('#on and #trigger', function() {
        it('a trigger must be listened', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                dummyObject.on('change', function(){
                    assert.ok(true);
                });

                dummyObject.trigger('change');
                done();
            });

        });

        it('this object must be the dispatcher', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                dummyObject.on('change', function(){
                    assert.equal(this, dummyObject);
                });

                dummyObject.trigger('change');
                done();
            });

        });

        it('data should be passed through the dispatched event', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                dummyObject.on('change', function(data){
                    assert.equal('test', data.test);
                });

                dummyObject.trigger('change', { test: 'test'});
                done();
            });

        });

        it('two triggers must be listened', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();
                var numAssertions = 0;

                dummyObject.on('change', function(){
                    assert.ok(true);
                    numAssertions++;
                    if(numAssertions === 2){
                        done();
                    }
                });

                dummyObject.trigger('change');
                dummyObject.trigger('change');
            });

        });
    });
});


describe('Sub channel trigger', function() {
    describe('Test sub channel trigger', function() {
        it('a trigger on a sub channel must be listened by its parent channel', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                dummyObject.on('change', function(){
                    assert.ok(true);
                });

                dummyObject.trigger('change:object');
                done();
            });

        });
        it('a trigger on a channel must not be listened by a child channel', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                dummyObject.on('change:object', function(){
                    assert.ok(false);
                });

                dummyObject.on('change', function(){
                    assert.ok(true);
                });

                dummyObject.trigger('change');
                done();
            });

        });
    });
});


describe('Sub sub channel trigger', function() {
    describe('Test sub sub channel trigger', function() {
        it('a trigger on a sub sub channel must be listened by its grand parent channel', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                dummyObject.on('change', function(){
                    assert.ok(true);
                });

                dummyObject.trigger('change:object:attribute');
                done();
            });

        });
        it('a trigger on a sub channel must not be listened by a sibling channel', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                dummyObject.on('change:object:attribute', function(){
                    assert.ok(false);
                });

                dummyObject.on('change', function(){
                    assert.ok(true);
                });


                dummyObject.trigger('change:object');
                dummyObject.trigger('change:attribute');
                done();
            });

        });
    });
});

describe('Remove listener', function() {
    describe('#off', function() {
        it('an added and removed event must not be listened anymore', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                function namedCallback(){
                    assert.ok(false);
                }

                dummyObject.on('change', namedCallback);
                dummyObject.off('change', namedCallback);

                dummyObject.trigger('change');
                done();
            });

        });
        it('an added and removed namespaced event must not be listened anymore', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                function namedCallback(){
                    assert.notOk(true);
                }

                dummyObject.on('change:object', namedCallback);
                dummyObject.off('change:object', namedCallback);

                dummyObject.trigger('change:object');
                done();
            });

        });
    });
});


describe('Once callback', function() {
    describe('#once', function() {
        it('a once callback must be called on a single trigger', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();

                dummyObject.once('change', function(){
                    assert.ok(true);
                });

                dummyObject.trigger('change');
                done();
            });

        });

        it('a once callback must be called a single time', function(done) {
            promise.then(function(value) {
                var DummyClass = value.default;
                var dummyObject = new DummyClass();
                var numAssertions = 0;
                function namedCallback(){
                    if(numAssertions === 0){
                        assert.ok(true);
                    }else{
                        assert.ok(false);
                    }
                    numAssertions++;
                }

                dummyObject.once('change', namedCallback);

                dummyObject.trigger('change');
                dummyObject.trigger('change');
                dummyObject.trigger('change');

                done();
            });

        });
    });
});
describe('Mutliple listeners', function() {
    it('coma separated events should listen to all registered events', function(done) {
        promise.then(function(value) {
            var DummyClass = value.default;
            var dummyObject = new DummyClass();
            var numAssertions = 0;

            dummyObject.on('change, test', function(){
                assert.ok(true);
                numAssertions++;
            });

            dummyObject.trigger('change');
            dummyObject.trigger('test');
            assert.ok(numAssertions === 2);
            done();
        });

    });
    it('space separated events should listen to all registered events', function(done) {
        promise.then(function(value) {
            var DummyClass = value.default;
            var dummyObject = new DummyClass();
            var numAssertions = 0;

            dummyObject.on('change test', function(){
                assert.ok(true);
                numAssertions++;
            });

            dummyObject.trigger('change');
            dummyObject.trigger('test');
            assert.ok(numAssertions === 2);
            done();
        });

    });

    it('sub channel coma separated events should listen to all registered events', function(done) {
        promise.then(function(value) {
            var DummyClass = value.default;
            var dummyObject = new DummyClass();
            var numAssertions = 0;

            dummyObject.on('change:attr, test:value', function(){
                assert.ok(true);
                numAssertions++;
            });

            dummyObject.trigger('change:attr');
            dummyObject.trigger('test:value');
            assert.ok(numAssertions === 2);
            done();
        });

    });

    it('sub channel space separated events should listen to all registered events', function(done) {
        promise.then(function(value) {
            var DummyClass = value.default;
            var dummyObject = new DummyClass();
            var numAssertions = 0;

            dummyObject.on('change:attr test:value', function(){
                assert.ok(true);
                numAssertions++;
            });

            dummyObject.trigger('change:attr');
            dummyObject.trigger('test:value');
            assert.ok(numAssertions === 2);
            done();
        });
    });

    it('sub channel space separated events should listen to all registered events (coma separated trigger)', function(done) {
        promise.then(function(value) {
            var DummyClass = value.default;
            var dummyObject = new DummyClass();
            var numAssertions = 0;

            dummyObject.on('change:attr test:value', function(){
                assert.ok(true);
                numAssertions++;
            });

            dummyObject.trigger('change:attr, test:value');
            assert.ok(numAssertions === 2);
            done();
        });
    });

    it('sub channel space separated events should listen to all registered events (space separated trigger)', function(done) {
        promise.then(function(value) {
            var DummyClass = value.default;
            var dummyObject = new DummyClass();
            var numAssertions = 0;

            dummyObject.on('change:attr test:value', function(){
                assert.ok(true);
                numAssertions++;
            });

            dummyObject.trigger('change:attr test:value');
            assert.ok(numAssertions === 2);
            done();
        });
    });
});