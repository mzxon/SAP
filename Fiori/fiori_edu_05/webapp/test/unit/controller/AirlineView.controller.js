/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_05/controller/AirlineView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AirlineView Controller");

	QUnit.test("I should test the AirlineView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
