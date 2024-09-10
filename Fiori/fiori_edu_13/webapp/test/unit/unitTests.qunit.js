/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"syncc1/fiori_edu_13/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
