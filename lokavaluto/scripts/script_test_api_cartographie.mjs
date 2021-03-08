import https from 'https';

const URL_TAXONOMY = "https://lokavaluto.dev.myceliandre.fr/web/get_application_taxonomy"
const URL_ELEMENTS = "https://lokavaluto.dev.myceliandre.fr/web/get_application_elements"

function runRequest(url, options) {
    console.log('runRequest', url, options);
    return new Promise((resolve, reject)=>{
        https.get(url, options, (err, res, body) => {
            if (err) { 
                reject(err);
            } else {
                 resolve(body);
            }
        });
    })
}

try {
    const map_taxonomy = await runRequest(`${URL_TAXONOMY}`, {});
    console.log('Map taxonomy', map_taxonomy);
    
    const map_elements = await runRequest(`${URL_ELEMENTS}`, {});
    console.log('Map elements', map_elements);

} catch(err) {
    console.error(err);
}
