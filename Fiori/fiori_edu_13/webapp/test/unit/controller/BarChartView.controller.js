/*global QUnit*/

sap.ui.define([
	"syncc1/fiori_edu_13/controller/BarChartView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("BarChartView Controller");

	QUnit.test("I should test the BarChartView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
