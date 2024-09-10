/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_12/controller/DonutView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("DonutView Controller");

	QUnit.test("I should test the DonutView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
