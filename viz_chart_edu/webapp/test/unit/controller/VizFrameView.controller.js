/*global QUnit*/

sap.ui.define([
	"sync4c1/viz_chart_edu/controller/VizFrameView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("VizFrameView Controller");

	QUnit.test("I should test the VizFrameView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
