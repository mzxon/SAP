/*global QUnit*/

sap.ui.define([
	"fiori_edu_02/sync4.c1/controller/YoutuView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("YoutuView Controller");

	QUnit.test("I should test the YoutuView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
