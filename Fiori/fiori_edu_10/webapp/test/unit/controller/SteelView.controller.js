/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_10/controller/SteelView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SteelView Controller");

	QUnit.test("I should test the SteelView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
