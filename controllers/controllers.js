require('dotenv').config();
const convert = require("xml-js");
const axios = require("axios");
const ussdCache = new Cache({ stdTTL: 60, deleteOnExpire: true, checkperiod: 30 });

let options = {compact: true, ignoreComment: true, spaces: 4};
let message = "";
let pageContent = {};
let xmlResponse;

module.exports.index = async (req, res) => {

    try {
        pageContent = {
            "title":`${process.env.pageTitle}`,
          "name": "Diool Bill payments",
            "message":"Enter Reference to Browse the Diool Bill or 0 to go back: ",
            "form": {
                "url": `${process.env.baseUrl}/checkBill`,
                "type": "text",
                "method": "get"
            },
            "page":{
                "menu":"true",
                "history":"true",
                "navigation_keywords":"true"
            }
        }

        xmlResponse = convert.xml2json(pageContent, options);

        res.send(xmlResponse);
       
    } catch (error) {
        pageContent = {
            "page":{
                "session_end":"true"
            },
            "message": `${error.message}`
            //"message": `We faced with an error while processing your request, please try again later`
        }

        xmlResponse = convert.xml2json(pageContent, options);

        res.send(xmlResponse);
    }
}

module.exports.checkBill = async (req, res) => {

    const userMsisdn = req.headers["user-msisdn"]; // You don't know how this value will be passed from their system to ours. We assume it will passed as header parameter. 
    const userEntry = req.headers["user-entry"]; // You don't know how this value will be passed from their system to ours. We assume it will passed as header parameter. 

   // Set the value in cache. 
   ussdCache.set(userMsisdn, userEntry);
    
    try {
        const response = await axios.get(`https://core.diool.com/core/onlinepayment/v1/payment/${userEntry}`, {
            headers: {
                "Authorization": `${process.env.checkBillToken}`,
                "Content-Type": "application/json",
                "X-Beversion": "4.0.0"
            }
        });
        
        const data = await response.data;

        if (data.code === 404) {

            message = "Oups, the bill number entered is incorrect. Please check the bill number and try again";

            pageContent = {
                "title":`${process.env.pageTitle}`,
                "name": "Diool Bill payments",
                "message":`${message}`,
                "form": {
                    "url": `${process.env.baseUrl}`,
                    "type": "text",
                    "method": "get"
                },
                "page":{
                    "menu":"true",
                    "history":"true",
                    "navigation_keywords":"true"
                }
            }

            xmlResponse = convert.json2xml(pageContent, options)
            
            res.send(xmlResponse)

           };

           
        if (data.code === 0 && data.result.status === "PENDING_PAYMENT" && data.result.amount > 1000000 ) {
            message = `Amount is not authorized by this payment method. Please call 650 774 040 for instructions on how to pay`;

            pageContent = {
                "page":{
                    "session_end":"true"
                },
                "message": `${message}`
            };
    
            xmlResponse = convert.json2xml(pageContent, options)
            
            res.send(xmlResponse)
    
           }

        if (data.code === 0 && data.result.status === "PENDING_PAYMENT") {
            message = `Bill From: ${data.result.sender.businessName}, \n Bill To: ${data.result.recipient.firstName}, \n Amount: ${data.result.amount}, \n For: ${data.result.paymentFor}, \n Pay before: ${new Date(data.result.expiresOn).toLocaleDateString()}`;

            pageContent = {
                "title":`${process.env.pageTitle}`,
              "name": "Diool Bill payments",
                "message":`${message}`,
                "links": [
                    {
                    "content":" Pay my Bill",
                    "url":`${process.env.baseUrl}/settleRfp` // We assume mtn will give us access to numbers.
                    },
                    {
                    "content":" To Quit",
                    "url":`${process.env.baseUrl}/quit` 
                    }
                ],
                "page":{
                    "menu":"true",
                    "history":"true",
                    "navigation_keywords":"true"
                }
            };
    
            xmlResponse = convert.json2xml(pageContent, options)
            
            res.send(xmlResponse)
    
           }
           
           if (data.code === 0 && (data.result.status === "PAID" || data.result.status === "EXPIRED") ) {
            message = `The bill with reference ${data.result.referenceId} of amount: ${data.result.amount} is already ${data.result.status}. Thank you very much for using Diool Bills Payment`;

            pageContent = {
                "page":{
                    "session_end":"true"
                },
                "message":`${message}`, // customize messages will be useful here. 
            };

            xmlResponse = convert.json2xml(pageContent, options)
            
            res.send(xmlResponse);
           }
  
    } catch (error) {
        res.json({
            "page":{
                "session_end":"true"
            },
            //"message": `${error.message}`
            "message": `We were faced with an error while processing your request, please try again later`
        }) 
    }    
  
   
} 

