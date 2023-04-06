const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req, res){
   res.sendFile(__dirname + "/signup.html");
});

//when data is received using the post method from the html form

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log(firstName, lastName, email);

    const url = "https://us10.api.mailchimp.com/3.0/lists/560fcc477a"
   
    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]

    };

    const jsonData = JSON.stringify(data);

    const options = {
        method:"POST",
        auth:"anand:80abf66f0f76d782cde8b84902caf568-us10"
    };

    const request = https.request(url, options, function(response){

        if (response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on(data, function(data){
            console.log(JSON.parse(data));
        });
    });

    //request.write(jsonData);
    request.end();


});

//failure post method will get input from button
app.post("/failure", function(req, res){
    res.redirect("/");
});


//post method ends here

app.listen(process.env.PORT || 3000, function(){
    console.log("server running on port 3000");    
});


//mail chimp details
// list id
//560fcc477a

//api key
//80abf66f0f76d782cde8b84902caf568-us10