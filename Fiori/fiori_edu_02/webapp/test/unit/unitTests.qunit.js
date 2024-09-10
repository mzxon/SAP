/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"fiori_edu_02/sync4.c1/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
