/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_03/controller/EduView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("EduView Controller");

	QUnit.test("I should test the EduView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
