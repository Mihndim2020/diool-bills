const axios = require("axios");

let url =  `/oauth/token`;

let options   = {
    "method": "POST",
    "headers": {
        "Content-Type"  : "application/x-www-form-urlencoded"
    },
    "body": `grant_type=client_credentials&client_id=""&client_secret=""&audience="https://127.0.0.1:8080/diool/api/v1"&environment="PREPROD"&isPaymentLink=true`
}

const generateToken = async () =>  {
    const response = await axios.post(url, options);
    const token = await response.data;
    console.log(token);

} 

generateToken();
