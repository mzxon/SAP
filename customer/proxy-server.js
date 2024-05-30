const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080; // 원하는 포트 번호로 변경 가능

// app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/kakao-pay-proxy", (req, res) => {
  const requestData = req.body;

  request.post(
    {
      url: "https://open-api.kakaopay.com/online/v1/payment/ready",
      headers: {
        Authorization: "SECRET_KEY DEVD44EE4AC3645D55D7E2D3F707D69B07EAA362",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.send(body);
      } else {
        res.status(500).send("Proxy server error");
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
