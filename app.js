const express = require("express");
const request = require("request");
const https = require("https");
const app = express();

const client = require("@mailchimp/mailchimp_marketing");
const { url } = require("inspector");

client.setConfig({
  apiKey: "2a62fa6c6683cc0dc630ba6532144774-us21",
  server: "us21",
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lasttName = req.body.lName;
  const email = req.body.email;

  const run = async () => {
    try{
    const response = await client.lists.batchListMembers("9cbe82a66f", {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lasttName,
          },
        },
      ],
    });
    console.log(response);
    res.sendFile(__dirname + "/success.html");} catch(err){
        console.log(err.status);
        res.sendFile(__dirname + "/failure.html");
    }
  };

  run();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(6969, function () {
  console.log("Server is running on port 6969.");
});
