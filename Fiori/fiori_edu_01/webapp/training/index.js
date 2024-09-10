//alert(document.getElementById("div").innerText);

// sap.ui.define([], () => {
//   "use strict";
//   alert("UI5 is ready");
// });

// sap.ui.define(["sap/m/Text"], (Text) => {
//   "use strict";
//   //Text API를 사용

//   new Text({
//     text: "Sync4",
//   }).placeAt("content"); //id가 content인 요소에 넣음

//   new Text({
//     text: "문지오",
//   }).placeAt("content2");
// });

// sap.ui.define([
// 	"sap/m/Text"
// ], (Text) => {
// 	"use strict";

// 	new Text({
// 		text: "Hello World"
// 	}).placeAt("content");
// });

sap.ui.define(["sap/ui/core/mvc/XMLView"], (XMLView) => {
  "use strict";

  XMLView.create({
    viewName: "sync4.fioriedu01.view.ZC113View",
  }).then((oView) => oView.placeAt("content"));
});
