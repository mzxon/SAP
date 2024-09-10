/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_m_01/controller/FioriView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FioriView Controller");

	QUnit.test("I should test the FioriView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
