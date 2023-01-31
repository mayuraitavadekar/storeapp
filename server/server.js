const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// initialize app
const app = express();

// use libraries
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true}));

// importing stripe and calling method
const stripe = require("stripe")("sk_test_51MVq8IAd2LteMoOHLeVCtuvg1qEdkzsF5MCIHA06xf4OPX7n2jtpyfNJ6ZcdW6pwe7ArlPHqVqhyWoWfaVKMOaRY00hArsCOk3");

// handle checkout route which is called by frontend app
app.post("/checkout", async(req, res, next) => {

    console.log("request reached");

    try
    {
        const session = await stripe.checkout.sessions.create({
            line_items: req.body.items.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        images: [item.product]
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: "http://localhost:4242/success.html",
            cancel_url: "http://localhost:4242/cancel.html"
        });
        
        return res.status(200).json(session);
    }
    catch(error)
    {   
        // pass error 
        next(error);
    }
});

// start on port 4242
app.listen(4242, () => console.log("app is running on 4242"));