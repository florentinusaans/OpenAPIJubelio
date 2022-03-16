import { check, group } from "k6";
import http from "k6/http";

export const options = { vus: 1, duration: "1s" };

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

    group("Test Case 59 - get AWB Valid Params", function () {
        response = http.post(`http://evm-shipment.dev.internal/open/v1/awb`,
        `{"orderReceiptCodeList": ["4780-1646721908","9329-1646634942"]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 59 : "+response.body)
        check(response, {
            'Get AWB is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
        });
    })

    group("Test Case 60 - get AWB Check Mandatory Field", function () {
        response = http.post(`http://evm-shipment.dev.internal/open/v1/awb`,
        `{"orderReceiptCodeList": []}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 60 : "+response.body)
        check(response, {
            'Get AWB is status 500': (r) => r.status === 500,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 61 - get AWB Check Data Type", function () {
        response = http.post(`http://evm-shipment.dev.internal/open/v1/awb`,
        '{"orderReceiptCodeList": [4780-1646721908,9329-1646634942]}',
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 61 : "+response.body)
        check(response, {
            'Get AWB is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 62 - get AWB Invalid Token", function () {
        const accessToken2="1446824813660774558114468248136607745582"
        response = http.post(`http://evm-shipment.dev.internal/open/v1/awb`,
        `{"orderReceiptCodeList": ["4780-1646721908","9329-1646634942"]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken2}`,
                },
                cookies : {accessToken : `${accessToken2}`}
            }
        );
        console.log("Respponse Body Test Case 62 : "+response.body)
        check(response, {
            'Get AWB is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 63 - get AWB Expired Token", function () {
        const accessToken3="1446824813660774558114468248136607745589"
        response = http.post(`http://evm-shipment.dev.internal/open/v1/awb`,
        `{"orderReceiptCodeList": ["4780-1646721908","9329-1646634942"]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken3}`,
                },
                cookies : {accessToken : `${accessToken3}`}
            }
        );
        console.log("Respponse Body Test Case 63 : "+response.body)
        check(response, {
            'Get AWB is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 64 - get AWB Unregister Order Receipt Code", function () {
        response = http.post(`http://evm-shipment.dev.internal/open/v1/awb`,
        `{"orderReceiptCodeList": ["3694-1646730438","1440-1646730410","8724-1646730424","4354-1646730193","9880-1646730180","5003-1646730164","6122-1646728172","4780-1646728106","6207-1646727961","8612-1646728016"]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 64 : "+response.body)
        check(response, {
            'Get AWB is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
        });
    })

    group("Test Case 65 - get AWB Invalid Order Receipt Code", function () {
        response = http.post(`http://evm-shipment.dev.internal/open/v1/awb`,
        `{"orderReceiptCodeList": [ "4780-1646721907"]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 65 : "+response.body)
        check(response, {
            'Get AWB is status 404': (r) => r.status === 404,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 66 - get AWB more than 25 Order Receipt Code", function () {
        response = http.post(`http://evm-shipment.dev.internal/open/v1/awb`,
        `{"orderReceiptCodeList": ["4780-1646721908","9329-1646634942","1531-1642477241","8008-1643261888","7644-1643261699","8308-1643261563","9124-1642491030","5267-1642470103","4901-1641953899","5572-1638847289","5519-1641356320","4708-1640067837","4558-1640055885","3902-1638946847","8829-1634533363","7582-1638522668","5832-1638514235","3754-1638497514","5023-1638414021","1232-1638269664","7212-1637832383","4887-1637655561","4500-1637655576","5826-1637640465","3257-1637639839","5627-1636103016"]}`,
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 66 : "+response.body)
        check(response, {
            'Get AWB is status 500': (r) => r.status === 500,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })
}