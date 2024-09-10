/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_m_02/controller/Flight_InfoView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Flight_InfoView Controller");

	QUnit.test("I should test the Flight_InfoView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
