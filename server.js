const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mailchimp = require('@mailchimp/mailchimp_marketing');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX, 
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "TASK2.1.html"));
});

app.post("/subscribe", async (req, res) => {
  const { first_name, last_name, email } = req.body;

  try {
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: first_name,
        LNAME: last_name
      }
    });

    console.log("Mailchimp response:", response);
    res.send("You've been subscribed! Watch your inbox for a welcome email.");
  } catch (err) {
    console.error(" Mailchimp error:", err);
    res.status(500).send(" Failed to subscribe. Email may already exist or be invalid.");
  }
});


app.listen(5500, () => {
  console.log(`Server running at http://localhost:5500`);
});
