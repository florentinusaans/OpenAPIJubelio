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
        console.log("Response Body Test Case 1 : "+response.body)
        accessToken = response.json()['data']['accessToken']
        check(response, {
            'Get Token is status 200': (r) => r.status === 200
        });
    })

    group("Test Case 55 - Stock Sync Positive Value",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const currentStock = 1;
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": ${currentStock},"variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 55 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 56 - Stock Sync Negative Value",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const currentStock = -1;
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": ${currentStock},"variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 56 : "+response.body)
        check(response, {
            'Update Stock is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error type is object': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 57 - Stock Sync Check Mandatory Field",function(){
        const varianrId='';
        const currentStock = '';
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": ${currentStock},"variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 57 : "+response.body)
        check(response, {
            'Update Stock is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error type is object': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 58 - Stock Sync Check Data Type",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const currentStock = "10";
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": "${currentStock}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 58 : "+response.body)
        check(response, {
            'Update Stock is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error type is object': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 59 - Stock Sync Invalid Token",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const currentStock = 1;
        const accessToken2 = "1446824813660774558114468248136607745582"
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": ${currentStock},"variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken2}`,
            },
            cookies : {accessToken : `${accessToken2}`}
        }
        )
        console.log("Response Body Test Case 59 : "+response.body)
        check(response, {
            'Update Stock is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error type is object': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 60 - Stock Sync Expired Token",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const currentStock = 1;
        const accessToken3 = "1446824813660774558114468248136607745589"
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": ${currentStock},"variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken3}`,
            },
            cookies : {accessToken : `${accessToken3}`}
        }
        )
        console.log("Response Body Test Case 60 : "+response.body)
        check(response, {
            'Update Stock is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error type is object': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 61 - Stock Sync Unregister Varint Id",function(){
        const varianrId='d84a1a0d-8a0d-46f9-8418-42c4ff07364d';
        const currentStock = 1;
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": ${currentStock},"variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 61 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty':(r) => r.json()['data']['failureList'].length !== 0,
            'successList is empty':(r) => r.json()['data']['successList'].length === 0
        });
    })

    group("Test Case 62 - Stock Sync Invalid Varint Id",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e9999999';
        const currentStock = 1;
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": ${currentStock},"variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 62 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty':(r) => r.json()['data']['failureList'].length !== 0,
            'successList is empty':(r) => r.json()['data']['successList'].length === 0
        });
    })

    group("Test Case 63 - Stock Sync Curent Stock 0",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const currentStock = 0;
        response = http.put('http://evm-inventory.dev.internal/open/v1/sync/stock',
        `{"stockList": [{"currentStock": ${currentStock},"variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 63 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })
}