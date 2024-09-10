/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_09/controller/Idol.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Idol Controller");

	QUnit.test("I should test the Idol controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
