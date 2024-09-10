sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("sync4.fioriedu01.controller.ZC113View2", {
      onInit: function () {},

      showMessage2: function (msg) {
        alert(msg);
      },
    });
  }
);
