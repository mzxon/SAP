sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/unified/DateRange",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/library",
    "sap/ui/core/date/UI5Date",
    "sap/m/MessageBox",
    "sap/ui/thirdparty/jquery",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    DateRange,
    DateFormat,
    coreLibrary,
    UI5Date,
    MessageBox,
    jQuery
  ) {
    "use strict";

    var CalendarType = coreLibrary.CalendarType;
    var payType = null;

    return Controller.extend("cust.customer.controller.Payment", {
      oFormatYyyymmdd: null,

      onInit: function () {
        this._getRouter()
          .getRoute("paymentView")
          .attachPatternMatched(this._onRouteMatched.bind(this), this);

        this.oFormatYyyymmdd = DateFormat.getInstance({
          pattern: "yyyy-MM-dd",
          calendarType: CalendarType.Gregorian,
        });

        // // Kakao SDK를 동적으로 로드합니다.
        // var script = document.createElement("script");
        // script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        // script.async = true;
        // document.body.appendChild(script);
      },

      //라우터 연결정보 가져오기
      _getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      //전달받은 파라미터 값 가져오기
      _onRouteMatched: function (oEvent) {
        var oCustno = oEvent.getParameter("arguments").Custno;
        var oSerno = oEvent.getParameter("arguments").Serno;

        console.log(oCustno);
        console.log(oSerno);
      },

      //날짜선택
      handleCalendarSelect: function (oEvent) {
        var oCalendar = oEvent.getSource();
        var oSelDate = oCalendar.getSelectedDates(),
          oDate = oSelDate[0].getStartDate();

        var today = new Date(); //오늘 날짜 가져오기

        alert(this.oFormatYyyymmdd.format(oDate));
      },

      nextStep: function () {
        // date FlexBox를 숨기고 pay FlexBox를 표시
        var oDateFlexBox = this.byId("date");
        var oPayFlexBox = this.byId("pay");

        oDateFlexBox.setVisible(false);
        oPayFlexBox.setVisible(true);
      },

      previousStep: function () {
        // pay FlexBox를 숨기고 date FlexBox를 표시
        var oDateFlexBox = this.byId("date");
        var oPayFlexBox = this.byId("pay");

        oDateFlexBox.setVisible(true);
        oPayFlexBox.setVisible(false);
      },

      handleSelectAll: function (oEvent) {
        // selectAllCheckBox가 체크되면 나머지 체크박스도 체크/언체크
        var bSelected = oEvent.getParameter("selected");
        this.byId("checkBox1").setSelected(bSelected);
        this.byId("checkBox2").setSelected(bSelected);
        this.byId("checkBox3").setSelected(bSelected);
      },

      onSelect: function (oEvent) {
        payType = null;
        var selectedRadioButton = oEvent.getSource();
        var id = selectedRadioButton.getId();
                    
        payType = id;
      },

      requestPay: function () {

        var IMP = window.IMP; 
        IMP.init("imp21380672"); 
      
        var today = new Date();   
        var hours = today.getHours(); // 시
        var minutes = today.getMinutes();  // 분
        var seconds = today.getSeconds();  // 초
        var milliseconds = today.getMilliseconds();
        var makeMerchantUid = hours +  minutes + seconds + milliseconds;
        
        var pg;
        switch (payType) {
          case '__button2':
            pg = 'kakaopay';
            break;
          case '__button3':
            pg = 'payco';
            break;
          case '__button4':
            pg = 'tosspay';
            break;
          case '__button5':
            pg = 'html5_inicis';
            break;

          default:
            alert("결제 수단을 선택해주세요");
            break;
        }

        IMP.request_pay({
            pg : pg,
            pay_method : 'card',
            merchant_uid: "IMP"+makeMerchantUid, 
            name : '당근 10kg',
            amount : 1004,
            buyer_email : 'Iamport@chai.finance',
            buyer_name : '아임포트 기술지원팀',
            buyer_tel : '010-1234-5678',
            buyer_addr : '서울특별시 강남구 삼성동',
            buyer_postcode : '123-456'
        }, function (rsp) { // callback
          if (rsp.success) {
              alert("결제되었습니다.");
              console.log(rsp);
          } else {
              alert("결제에 실패했습니다.");	
              console.log(rsp);
          }
        });

        
      }
    });
  }
);
