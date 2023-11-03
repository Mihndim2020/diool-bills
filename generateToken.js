const axios = require("axios");

let url =  `https://auth.diool.com/oauth/token`;

let options   = {
    "method": "POST",
    "headers": {
        "Content-Type"  : "application/x-www-form-urlencoded"
    },
    "body": `grant_type=client_credentials&client_id="71018ZtrizNnHHawXxeI1WfpBRXmb9Yl"&client_secret="MNPEaXN4DBql2LhMmKmiN5919qjWGvNuDxjEVc-RUeAPAMvYOCn6UfVUePNUsS7m"&audience="https://127.0.0.1:8080/diool/api/v1"&environment="PREPROD"&isPaymentLink=true`
}

const generateToken = async () =>  {
    const response = await axios.post(url, options);
    const token = await response.data;
    console.log(token);

} 

generateToken();