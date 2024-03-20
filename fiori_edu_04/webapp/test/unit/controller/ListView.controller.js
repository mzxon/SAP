/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_04/controller/ListView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ListView Controller");

	QUnit.test("I should test the ListView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
