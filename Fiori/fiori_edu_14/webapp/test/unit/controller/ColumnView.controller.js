/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_14/controller/ColumnView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ColumnView Controller");

	QUnit.test("I should test the ColumnView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
