sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
  ], //여기서 임포트한거는 function 매개변수에 순서대로 다 적어줘야함
  //배열안에 들어있기때문에 순서를 지켜야함
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, JSONModel, ResourceModel) {
    "use strict";

    return Controller.extend("fioriedu02.sync4.c1.controller.YoutuView", {
      onInit: function () {
        //바로 호출되는 녀석
        const oData = {
          gs_data: {
            name: "SYNC 4",
            area: "종각 솔데스크",
          }, //oData를 정의함 (Json형태 key:value)
        };
        const oModel = new JSONModel(oData); //oModel을 OData의 Json형태로 선언
        //var, let, const 선언 방식 -> 변수, 객체 등등 가시적인 효과?
        this.getView().setModel(oModel); //this : 현재 연결된 뷰
        //getView() : 속성 가져옴
        //setModel() : 뷰를 ()로 맞춰줌

        const i18nModel = new ResourceModel({
          bundleName: "ui5.walkthrough.i18n.i18n",
        });
        this.getView().setModel(i18nModel, "i18n");
      },
      onShowHello() {
        // read msg from i18n model
        const name = this.getView()
          .getModel(oModel)
          .getProperty("gs_data/name");
        const oBundle = this.getView().getModel("i18n").getResourceBundle();
        const sRecipient = this.getView()
          .getModel()
          .getProperty("/recipient/name");
        const sMsg = oBundle.getText("helloMsg", [sRecipient]);

        // show message
        MessageToast.show(sMsg);
      },
    });
  }
);
