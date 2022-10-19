const http = require("http");
const fs = require("fs");
const request = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempval, orgval) => {
  let celciusTemp = orgval.main.temp;
  let celciusToTempMin = orgval.main.temp_min;
  let celciusToTempMax = orgval.main.temp_min;

  var fToc = Math.floor(((celciusTemp - 32) * 5) / 9);
  var fTocMin = Math.floor(((celciusToTempMin - 32) * 5) / 9);
  var fTocMax = Math.floor(((celciusToTempMax - 32) * 5) / 9);
  // console.log(fToc);

  let temprature = tempval.replace("{%temp%}", fToc);
  temprature = temprature.replace("{%tempmin%}", fTocMin);
  temprature = temprature.replace("{%tempmax%}", fTocMax);
  temprature = temprature.replace("{%location%}", orgval.name);
  temprature = temprature.replace("{%country}", orgval.sys.country);
  temprature = temprature.replace("{%tempstatus%}", orgval.weather[0].main);
  return temprature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    request(
      "https://api.openweathermap.org/data/2.5/weather?q=Monrovia,lr&appid=7a3fdd0372ec6c8de04adb93ab3df9d5"
    )
      .on("data", (chunk) => {
        const parseData = JSON.parse(chunk);
        const arrayData = [parseData];
        // console.log(arrayData[0].main.temp);
        const currentData = arrayData
          .map((value) => {
            console.log(value.name);
            return replaceval(homeFile, value);
          })
          .join("");
        res.write(currentData);
        // console.log(currentData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        // res.end();
        console.log("end");
      });
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server listning on port 8000");
});
