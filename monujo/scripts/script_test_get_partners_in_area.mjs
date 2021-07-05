import https from 'https';

const URL_MAP = 'https://odoo12.dev.lokavaluto.fr/lokavaluto_api/public/partner_map/search_in_area';
const LAT_MIN = '11.0';
const LAT_MAX = '12.0';
const LON_MIN = '-55.5';
const LON_MAX = '-50.5';
const CATEGORY = 'Agriculture';

function runPost(url, jsonData, options) {
    const data = JSON.stringify(jsonData);
    console.log('runRequest', url, data, options);
    return new Promise((resolve, reject) => {
        const req = https.request(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                },
                ...options
            },
            (res) => {
                let data = '';
                
                res.on('data', chunk => {
                  data += chunk.toString('utf8');
                });
                res.on('end', () => {
                  resolve(JSON.parse(data));
                });
            }
        );

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}
function runGet(url, options) {
    console.log('runRequest', encodeURI(url), options);
    return new Promise((resolve, reject) => {
        https.get(encodeURI(url), options, (res) => {
          let data = '';
          res.on('data', chunk => {
            data += chunk.toString('utf8');
          });
          res.on('end', () => {
            resolve(JSON.parse(data));
          });
          res.on('error', (error) => {
              reject(error);
          });
        });
    });
}

try {
    console.log('NO CATEGORY FILTER');
    let res = await runPost(
        `${URL_MAP}`,
        {
	    bounding_box: {
  	        minLat: `${LAT_MIN}`,
	        maxLat: `${LAT_MAX}`,
                minLon: `${LON_MIN}`,
                maxLon: `${LON_MAX}`
            },
	    categories: []
        },
    );
    console.log('partner info : ', JSON.stringify(res));
    console.log('===================== ');
    console.log('FILTER ON A CATEGORY');
    res = await runPost(
        `${URL_MAP}`,
        {
            bounding_box: {
                minLat: `${LAT_MIN}`,
                maxLat: `${LAT_MAX}`,
                minLon: `${LON_MIN}`,
                maxLon: `${LON_MAX}`
            },
            categories: ['Manufacturing', 'Agriculture']
        },
    );
    console.log('partner info : ', res);

} catch (err) {
    console.error(err.statusCode, err.statusMessage, err.toString(), err.stack);
}

