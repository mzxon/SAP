/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sync4c1/viz_chart_edu/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
