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

        // Kakao SDK를 동적으로 로드합니다.
        var script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.async = true;
        document.body.appendChild(script);
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

      //다음버튼
      nextStep: function () {
        alert("여기임");
        var that = this;

        // 결제 준비를 위한 데이터 설정
        var requestData = {
          cid: "TC0ONETIME",
          partner_order_id: "partner_order_id",
          partner_user_id: "partner_user_id",
          item_name: "초코파이",
          quantity: "1",
          total_amount: "2200",
          vat_amount: "200",
          tax_free_amount: "0",
          approval_url: "https://developers.kakao.com/success",
          fail_url: "https://developers.kakao.com/fail",
          cancel_url: "https://developers.kakao.com/cancel",
        };

        $.ajax({
          url: "http://localhost:8080/kakao-pay-proxy", // 프록시 서버 주소로 변경합니다.
          method: "POST",
          contentType: "application/json",
          crossDomain: true,
          data: JSON.stringify(requestData),
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:8080",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          success: function (response) {
            // 성공적으로 응답을 받은 경우
            MessageBox.success("결제 준비가 완료되었습니다.");
            // 응답 데이터를 콘솔에 출력하여 확인
            console.log(response);
            // 응답 데이터를 사용하여 결제 페이지로 이동하는 로직 추가
            // 예를 들어, response.next_redirect_mobile_url 등을 사용하여 결제 페이지로 이동할 수 있습니다.
          },
          error: function (xhr, status, error) {
            // 요청이 실패한 경우
            MessageBox.error(
              "결제 요청을 처리하는 도중 에러가 발생했습니다. 관리자에게 문의해주세요. 에러 메시지: " +
                error
            );
          },
        });
      },
    });
  }
);
