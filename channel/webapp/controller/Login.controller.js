sap.ui.define(
  [
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    MessageToast,
    Fragment,
    Controller,
    JSONModel,
    Fliter,
    FilterOperator
  ) {
    "use strict";
    let oID;
    let oPW;

    return Controller.extend("chn.channel.controller.Login", {
      onInit: function () {},

      //로그인페이지로 이동
      navToMain: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("mainView");
      },

      Login: function () {
        //로그인 버튼
        oID = this.byId("custid").getValue();
        var lv_pw = this.byId("custpw").getValue(),
          lv_this = this,
          oModel = this.getView().getModel();

        // let oBinding = oMainTable.getBinding("rows"),
        //   oFilter = null,
        //   aFliters = [];

        if (oID == "") {
          alert("아이디를 입력하세요.");
        } else {
          if (lv_pw == "") {
            // alert("비밀번호를 입력하세요.");
            alert(oID);
          }

          oModel.read("/MemberSet('" + oID + "')", {
            success: function (oData) {
              if (lv_pw == oData.Custpw) {
                alert("로그인에 성공했습니다.");

                this.onSet(oData);
              } else {
                alert("비밀번호가 맞지 않습니다.");
              }
            }.bind(this),
            error: function (oData) {
              MessageToast.show("Error");
            },
          });

          // oFilter = new Fliter({
          //   //아이디
          //   path: "Custid",
          //   Operator: FilterOperator.Contains,
          //   value1: oID,
          // });

          // aFliters.push(oFilter);

          // oFilter = new Fliter({
          //   //비밀번호
          //   path: "Custpw",
          //   Operator: FilterOperator.Contains,
          //   value1: lv_pw,
          // });

          // aFliters.push(oFilter);
        }

        // oBinding.filter(aFliters);
      },

      onSet: function (oDataSet) {
        oPW = oDataSet.Custpw;

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("mainView", {
          EmpId: "아이디",
          EmpPw: "비밀번호",
        });
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
