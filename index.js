const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homefile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempval, orgval) => {
  let temp = tempval.replace("{%tempval%}", orgval.main.temp);
  temp = temp.replace("{%tempmin%}", orgval.main.temp_min);
  temp = temp.replace("{%tempmax%}", orgval.main.temp_max);
  temp = temp.replace("{%location%}", orgval.name);
  temp = temp.replace("{%country%}", orgval.sys.country);
  temp = temp.replace("{%tempstatus%}", orgval.weather[0].main);
  return temp;
};
const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Durgapur&units=metric&appid=eba1e8f627ab3b45d9a1fd182860739e"
    )
      .on("data", function (chunk) {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
        // console.log(arrdata);
        const realtimedata = arrdata
          .map((val) => replaceVal(homefile, val))
          .join("");
        res.write(realtimedata);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        // console.log("end");
      });
  }
});
server.listen(3000, "127.0.0.1");
