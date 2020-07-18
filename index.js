require("dotenv").config();
var Twit = require("twit");
const fetch = require("node-fetch");

var T = new Twit({
  consumer_key: process.env.API_KEY, //API Key
  consumer_secret: process.env.API_SECRET_KEY, // Api secret key
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

setInterval(tweetQuote, 1000 * 60 * 60 * 24);

async function tweetQuote() {
  const response = await fetch(process.env.API_URL).then((r) => r.json());
  var res = response.contents["quotes"][0];
  var quote = res.quote;
  var author = res.author;
  tweetIt(quote + " -" + author);
}

var stream = T.stream("statuses/filter", {
  track: "#botbyakrit",
  language: "en",
});

stream.on("tweet", tweetThanks);

function tweetThanks(eventMsg) {
  var name = eventMsg.user.name;
  var screenName = eventMsg.user.screen_name;
  tweetIt("Thank You " + "@" + screenName + " for using my bot.");
}

function tweetIt(txt) {
  var tweet = {
    status: txt,
  };
  T.post("statuses/update", tweet, tweeted);
  function tweeted(err, data, response) {
    if (err) {
      console.log("Something went wrong!");
    } else {
      console.log("tweeted");
    }
  }
}
