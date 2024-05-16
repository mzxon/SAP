let oID;

sap.ui.define(
  [
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Fragment, Controller, JSONModel, Fliter, FilterOperator) {
    "use strict";

    return Controller.extend("chn.channel.controller.Channel_Management", {
      onInit: function () {
        //   set explored app's demo model on this sample
        // var oModel = new JSONModel(
        //   sap.ui.require.toUrl("sap/ui/demo/mock/supplier.json")
        // );
        // oModel.attachRequestCompleted(
        //   function () {
        //     this.byId("login").setEnabled(true);
        //   }.bind(this)
        // );
        // this.getView().setModel(oModel);
        // this.getView().bindElement("/SupplierCollection/0");
        // this._formFragments = {}; //페이지이동용
        // this._showFormFragment("Login"); //처음에 보여줄 페이지
      },

      //로그인페이지로 이동
      navToMain: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("mainView");
      },

      Login: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("mainView");
        //로그인 버튼
        oID = this.byId("custid").getValue();
        var lv_pw = this.byId("custpw").getValue();

        let oBinding = oMainTable.getBinding("rows"),
          oFilter = null,
          aFliters = [];

        if ((oID = "")) {
          alert("아이디를 입력하세요.");
        } else {
          if ((lv_pw = "")) {
            alert("비밀번호를 입력하세요.");
          }
          oFilter = new Fliter({
            //아이디
            path: "Custid",
            Operator: FilterOperator.Contains,
            value1: oID,
          });

          aFliters.push(oFilter);

          oFilter = new Fliter({
            //비밀번호
            path: "Custpw",
            Operator: FilterOperator.Contains,
            value1: lv_pw,
          });

          aFliters.push(oFilter);
        }

        oBinding.filter(aFliters);
      },

      //fragment 가져오기
      _getFormFragment: function (sFragmentName) {
        var pFormFragment = this._formFragments[sFragmentName],
          oView = this.getView();

        if (!pFormFragment) {
          pFormFragment = Fragment.load({
            id: oView.getId(),
            name: "chn.channel.controller.Channel_Management." + sFragmentName,
          });
          this._formFragments[sFragmentName] = pFormFragment;
        }

        return pFormFragment;
      },

      //fragment 보여주기
      _showFormFragment: function (sFragmentName) {
        var oPage = this.byId("Login");

        oPage.removeAllContent();
        this._getFormFragment(sFragmentName).then(function (oVBox) {
          oPage.insertContent(oVBox);
        });
      },
    });
  }
);
