QUnit.module('WebApp');

QUnit.test('WebApp.sharedInstance()', function () {
	ok(WebApp.sharedInstance(), 'WebApp.sharedInstance()');
});
