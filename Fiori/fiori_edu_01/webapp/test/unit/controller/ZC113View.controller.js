/*global QUnit*/

sap.ui.define([
	"sync4/fiori_edu_01/controller/ZC113View.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ZC113View Controller");

	QUnit.test("I should test the ZC113View controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
