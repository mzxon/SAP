sap.ui.define(
  [
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (MessageToast, Controller, Fragment, syncStyleClass) {
    "use strict";

    //Custno
    let Custno;
    var iTimeoutId;

    return Controller.extend("cust.customer.controller.Login", {
      onInit: function () {},

      //로그인 버튼
      Login: function () {
        let lv_id = this.byId("custid").getValue(),
          lv_pw = this.byId("custpw").getValue(),
          oModel = this.getView().getModel();

        if (lv_id == "") {
          alert("아이디를 입력하세요.");
        } else {
          if (lv_pw == "") {
            alert("비밀번호를 입력하세요.");
          }

          //entityset
          oModel.read("/MemberSet('" + lv_id + "')", {
            success: function (oData) {
              if (lv_pw == oData.Custpw) {
                if (!this._pBusyDialog) {
                  this._pBusyDialog = Fragment.load({
                    name: "cust.customer.view.Login",
                    controller: this,
                  }).then(
                    function (oBusyDialog) {
                      this.getView().addDependent(oBusyDialog);
                      syncStyleClass(
                        "sapUiSizeCompact",
                        this.getView(),
                        oBusyDialog
                      );
                      return oBusyDialog;
                    }.bind(this)
                  );
                }

                this._pBusyDialog.then(
                  function (oBusyDialog) {
                    oBusyDialog.open();
                    this.simulateServerRequest(oData);
                  }.bind(this)
                );
              } else {
                alert("비밀번호가 맞지 않습니다.");
              }
            }.bind(this),
            error: function (oData) {
              MessageToast.show("로그인에 실패했습니다.");
            },
          });
        }
      },

      //로그인 성공 시 Custno 가져오기
      onSet: function (oData) {
        Custno = oData.Custno;

        this._getRouter().navTo("mainView", {
          Custno: Custno,
        });
      },

      //라우터 정보가져오기
      _getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      //로그인 로딩 팝업창
      simulateServerRequest: function (oData) {
        iTimeoutId = setTimeout(
          function () {
            this._pBusyDialog.then(
              function (oBusyDialog) {
                oBusyDialog.close();
                this.onSet(oData);
              }.bind(this)
            );
          }.bind(this),
          1000
        );
      },

      onDialogClosed: function (oEvent) {
        clearTimeout(iTimeoutId);

        if (oEvent.getParameter("cancelPressed")) {
          MessageToast.show("로그인이 취소되었습니다.");
        } else {
          MessageToast.show("로그인되었습니다.");
        }
      },
    });
  }
);
