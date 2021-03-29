import https from 'https';

const URL_PARTNER = "https://laroue.v12.dev.myceliandre.fr/lokavaluto_api/private/partner/?name=a patons rompus"

function runRequest(url, options) {
    console.log('runRequest', url, options);
    return new Promise((resolve, reject)=>{
        https.get(encodeURI(url), options, (err, res, body) => {
            if (err) { 
                reject(err);
            } else {
                 resolve(body);
            }
        });
    })
}

try {
    const info_partner = await runRequest(`${URL_PARTNER}`, {});
    console.log('Partner info : ', info_partner);
    
} catch(err) {
    console.error(err.statusCode, err.statusMessage, err);
}
