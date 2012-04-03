QUnit.module('webapp');

QUnit.test('webapp.sharedInstance()', function () {
	ok(webapp.sharedInstance(), 'webapp.sharedInstance()');
});
