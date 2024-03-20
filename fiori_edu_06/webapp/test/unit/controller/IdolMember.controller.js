/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_06/controller/IdolMember.controller"
], function (Controller) {
	"use strict";

	QUnit.module("IdolMember Controller");

	QUnit.test("I should test the IdolMember controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
