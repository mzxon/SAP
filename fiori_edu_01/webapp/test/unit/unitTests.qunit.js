/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sync4/fiori_edu_01/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
