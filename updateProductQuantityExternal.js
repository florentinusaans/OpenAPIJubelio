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

    group("Test Case 46 - Inbound/Outbound Add Stock",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const newStock = 1;
        const notes='nambah 1';
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": ${newStock},"notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Respponse Body Test Case 46 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty': (r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty': (r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 47 - Inbound/Outbound Check Mandatory Field",function(){
        const varianrId='';
        const newStock = '';
        const notes='';
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": ${newStock},"notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Respponse Body Test Case 47 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 48 - Inbound/Outbound Check Data Type",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const newStock = '5';
        const notes='Check data type';
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": "${newStock}","notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Respponse Body Test Case 48 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 49 - Inbound/Outbound Invalid Token",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const newStock = '5';
        const notes='Check data type';
        const accessToken2='1446824813660774558114468248136607745582'
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": ${newStock},"notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken2}`,
            },
            cookies : {accessToken : `${accessToken2}`}
        }
        )
        console.log("Respponse Body Test Case 49 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 50 - Inbound/Outbound Expired Token",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const newStock = '5';
        const notes='Check data type';
        const accessToken3='1446824813660774558114468248136607745589'
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": ${newStock},"notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken3}`,
            },
            cookies : {accessToken : `${accessToken3}`}
        }
        )
        console.log("Respponse Body Test Case 50 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 51 - Inbound/Outbound Unregister VariantId",function(){
        const varianrId='1cbfec22-a7ed-4014-bdc8-94ee6f051187';
        const newStock = 1;
        const notes='nambah 1';
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": ${newStock},"notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Respponse Body Test Case 51 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty': (r) => r.json()['data']['failureList'].length !== 0,
            'successList is empty': (r) => r.json()['data']['successList'].length === 0
        });
    })

    group("Test Case 52 - Inbound/Outbound Invalid VariantId",function(){
        const varianrId='1cbfec22-a7ed-4014-bdc8-94ee6f099999';
        const newStock = 1;
        const notes='nambah 1';
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": ${newStock},"notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Respponse Body Test Case 52 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty': (r) => r.json()['data']['failureList'].length !== 0,
            'successList is empty': (r) => r.json()['data']['successList'].length === 0
        });
    })

    group("Test Case 53 - Inbound/Outbound Reduce Stock",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const newStock = -1;
        const notes='kurang 1';
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": ${newStock},"notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Respponse Body Test Case 53 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty': (r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty': (r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 54 - Inbound/Outbound reduce stock more than current value",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const newStock = -10;
        const notes='kurang 10';
        response = http.put('http://evm-inventory.dev.internal/open/v1/product/quantity',
        `{"stockList": [{"newStock": ${newStock},"notes": "${notes}","variantId": "${varianrId}"}]}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Respponse Body Test Case 54 : "+response.body)
        check(response, {
            'Update Stock Inbound/Outbound is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty': (r) => r.json()['data']['failureList'].length !== 0,
            'reason is string': (r) => typeof r.json()['data']['failureList'][0]['reason'] === 'string',
            'successList is empty': (r) => r.json()['data']['successList'].length === 0
        });
    })
}