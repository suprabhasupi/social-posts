
const https = require("https");
function getCountries(s, p) {
  fetchCountries(s, p).then((res) => {
    const totalPage = res.total_pages;
    let requestes = [];
    let filteredCountry = res.data.filter((c) => c.population > p);
    let count = filteredCountry.length
    for (let i = 2; i <= totalPage; i++) {
      requestes.push(fetchCountries(s, p, i));
    }
    Promise.all(requestes).then((res) => {
    // console.log("getCountries -> res", res)
      for (let i = 0; i < res.length; i++) {
        //   console.log("res[i].data-->", res[i].data)
        let otherData = res[i].data.filter((r) => r.population > p);
        count += otherData.length
        console.log("getCountries -> count", count)
      }
      // let otherData = res.filter(r => r.data.population > p)

      console.log("test -->", filteredCountry.length);
    });
    console.log(filteredCountry.length);
  });
}

function fetchCountries(s, p, page = 1) {
  return new Promise((resolve, reject) => {
    https
      .get(
        `https://jsonmock.hackerrank.com/api/countries/search?name=${s}&page=${page}`,
        (resp) => {
          let data = "";

          // A chunk of data has been recieved.
          resp.on("data", (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on("end", () => {
            const resData = JSON.parse(data);
            resolve(resData);
          });
        }
      )
      .on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
  });
}

getCountries("in", 1000000);