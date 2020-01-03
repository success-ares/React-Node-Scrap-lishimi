const request = require('request')
const cheerio = require('cheerio')

Array.prototype.unique = function () {
  return Array.from(new Set(this));
}

// const options = {
//   url: `https://www.zocdoc.com/doctor/michael-raffinan-md-7115`,
// }

class scrapController {

  async scrapAction(req, res) {
    console.log("req:" + req);
    let options = req.body.url;
    var baseurl = "http://" + options.split('/')[2];
    var baseurlssl = "https://" + options.split('/')[2];
    console.log("baseurl" + baseurl);
    console.log("options:" + options);
    var doctor = {
      h: [],
      hcount:0,
      pictures: [],
      internallinks: [],
      externallinks: [],
      title: '',
    }

    request(options, (error, response, data) => {
      if (error) {
        console.log('Something\'s wrong: ', error);
        if (error.errno == 'ENOTFOUND') {
          doctor = { message: error.hostname + ' Unexisted url' };
          res.json({ status: 404, results: doctor });
        }
        else {
          doctor = { message: "Bad Request" };
          res.json({ status: 400, results: doctor })
        }
      }
      else {

        const $ = cheerio.load(data)
        console.log("ok");
        for (var i = 1; i < 7; i++) {
          let num = $(`h${i}`).length;
          doctor.h.push(`h${i}: ${num}`);
          doctor.hcount = doctor.hcount + num;
        }
        console.log(doctor.hcount);
        console.log(doctor.h);


        let title = $('title').text().trim()
        doctor.title = title
        console.log("page title:" + doctor.title);

        let pic = $('img');
        console.log("count of pic");
        console.log(pic.length);
        if (pic.length > 0) {
          for (var i = 0; i < pic.length; i++) {
            let picture = pic[i].attribs.src;
            doctor.pictures.push(`${picture}`);
          }
        }
        console.log(doctor.pictures);

        let links = $('a');
        console.log(links.length);
        for (var i = 0; i < links.length; i++) {
          
          if (typeof links[i].attribs.href !== 'undefined') {
            if (links[i].attribs.href.search("http://") != -1 || links[i].attribs.href.search("https://") != -1) {
              if (links[i].attribs.href.search(baseurl) != -1 || links[i].attribs.href.search(baseurlssl) != -1) {
                let internallink = links[i].attribs.href;
                doctor.internallinks.push(internallink);
              }
              else {
                let externallink = links[i].attribs.href;
                doctor.externallinks.push(externallink);
              }
            }
            else {
              let internallink = links[i].attribs.href;
              doctor.internallinks.push(internallink);
            }
          }
        }
        console.log(doctor.internallinks);
        console.log(doctor.externallinks);

        res.json({ status: 200, results: doctor })
      }
    });
  }
}

module.exports = scrapController;

