import { check, group } from "k6";
import http from "k6/http";

// export const options = { vus: 1, duration: "1s" };

export default function main(){
    let response;
    let accessToken;
    const clientKey = 'kintakun';
    const clientSecret = '5876509264279814340158765092642798143401';

    group("Test Case 1 - Generate Token", function () {
        response = http.post('http://evm-auth.dev.internal/open/v1/generate',
            `{"clientKey":"${clientKey}","clientSecret":"${clientSecret}"}`,
            {
                headers :{
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Respponse Body Test Case 1 : "+response.body)
        accessToken = response.json()['data']['accessToken']
        let messageGetToken = response.json()['message']
        console.log(`Response message is : ${messageGetToken}`)
        check(response, {
            'Get Token is status 200': (r) => r.status === 200,
        });
    })

    group("Test Case 67 - Input AWB Non Cashless Valid Params", function(){
        const awbNo = 'TF1603001';
        const orderReceiptCode = '2486-1646970213';
        response = http.put('http://evm-shipment.dev.internal/open/v1/awb/non-cashless',
        `{"orderList": [{"awbNo": "${awbNo}","orderReceiptCode": "${orderReceiptCode}"}]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        )
        console.log("Respponse Body Test Case 67 : "+response.body)
        check(response, {
            'Input AWB Non Cashless is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty': (r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty': (r) => r.json()['data']['successList'].length !== 0,
        });
    })

    group("Test Case 68 - Input AWB Non Cashless Check Mandatory Field", function(){
        const awbNo1 = '';
        const orderReceiptCode1 = '';
        response = http.put('http://evm-shipment.dev.internal/open/v1/awb/non-cashless',
        `{"orderList": [{"awbNo": "${awbNo1}","orderReceiptCode": "${orderReceiptCode1}"}]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        )
        console.log("Respponse Body Test Case 68 : "+response.body)
        check(response, {
            'Input AWB Non Cashless is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 69 - Input AWB Non Cashless Check Data Type", function(){
        const awbNo2 = 'APIFLO1603001';
        const orderReceiptCode2 = '2408-1646796713';
        response = http.put('http://evm-shipment.dev.internal/open/v1/awb/non-cashless',
        `{"orderList": [{"awbNo": ${awbNo2},"orderReceiptCode": ${orderReceiptCode2}}]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        )
        console.log("Respponse Body Test Case 69 : "+response.body)
        check(response, {
            'Input AWB Non Cashless is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 70 - Input AWB Non Cashless Invalid Token", function(){
        const awbNo3 = 'TF1103001';
        const orderReceiptCode3 = '2486-1646970213';
        const accessToken2 = '1446824813660774558114468248136607745582'
        response = http.put('http://evm-shipment.dev.internal/open/v1/awb/non-cashless',
        `{"orderList": [{"awbNo": "${awbNo3}","orderReceiptCode": "${orderReceiptCode3}"}]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken2}`,
                },
                cookies : {accessToken : `${accessToken2}`}
            }
        )
        console.log("Respponse Body Test Case 70 : "+response.body)
        check(response, {
            'Input AWB Non Cashless is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 71 - Input AWB Non Cashless Expired Token", function(){
        const awbNo4 = 'TF1103001';
        const orderReceiptCode4 = '2486-1646970213';
        const accessToken3 = '1446824813660774558114468248136607745589'
        response = http.put('http://evm-shipment.dev.internal/open/v1/awb/non-cashless',
        `{"orderList": [{"awbNo": "${awbNo4}","orderReceiptCode": "${orderReceiptCode4}"}]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken3}`,
                },
                cookies : {accessToken : `${accessToken3}`}
            }
        )
        console.log("Respponse Body Test Case 71 : "+response.body)
        check(response, {
            'Input AWB Non Cashless is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 72 - Input AWB Non Cashless Unregister Order Receipt Code", function(){
        const awbNo5 = 'TF1103002';
        const orderReceiptCode5 = '8612-1646728016';
        response = http.put('http://evm-shipment.dev.internal/open/v1/awb/non-cashless',
        `{"orderList": [{"awbNo": "${awbNo5}","orderReceiptCode": "${orderReceiptCode5}"}]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        )
        console.log("Respponse Body Test Case 72 : "+response.body)
        check(response, {
            'Input AWB Non Cashless is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty': (r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty': (r) => r.json()['data']['successList'].length !== 0,
        });
    })

    group("Test Case 72 - Input AWB Non Cashless Invalid Order Receipt Code", function(){
        const awbNo6 = 'TF1103003';
        const orderReceiptCode6 = '2408-1646796714';
        response = http.put('http://evm-shipment.dev.internal/open/v1/awb/non-cashless',
        `{"orderList": [{"awbNo": "${awbNo6}","orderReceiptCode": "${orderReceiptCode6}"}]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        )
        console.log("Respponse Body Test Case 72 : "+response.body)
        check(response, {
            'Input AWB Non Cashless is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty': (r) => r.json()['data']['failureList'].length !== 0,
            'successList is empty': (r) => r.json()['data']['successList'].length === 0,
        });
    })
}