/*global QUnit*/

sap.ui.define([
	"sync4c1/fiori_edu_07/controller/Airline_Info_CDSView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Airline_Info_CDSView Controller");

	QUnit.test("I should test the Airline_Info_CDSView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
