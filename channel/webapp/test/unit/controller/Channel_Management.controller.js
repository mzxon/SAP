/*global QUnit*/

sap.ui.define([
	"chn/channel/controller/Channel_Management.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Channel_Management Controller");

	QUnit.test("I should test the Channel_Management controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
