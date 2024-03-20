/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sync4c1/fiori_edu_m_02/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
