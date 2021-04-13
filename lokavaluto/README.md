# Lokavaluto


## Doc Lokavaluto

https://laroue.v12.dev.myceliandre.fr/api-docs?urls.primaryName=lokavaluto_api%2Fprivate%3A%20partner#/default

## First User Stories

### Offline (no account)

* map view 

### Online

* login with login/password
  * retrieve token

```
curl --request POST \
  --url https://laroue.v12.dev.myceliandre.fr/lokavaluto_api/public/auth/authenticate \
  --header 'Authorization: Basic dGVzdEB0ZXN0LmNvbTp0ZXN0' \
  --header 'Content-Type: application/json' \
  --cookie session_id=7e74b241c664ca20ce3f0fc2ca9cc1f028ee4907 \
  --data '{
  "db": "laroue.v12.dev.myceliandre.fr",
  "params": [
    "lcc_app","cyclos","demo"
  ]
}'
```

* get user accounts  and balances 
* For the next  user stories you can decide :
  * list favorites 
  * see account "profile"
  * ...


## Nativescript

Nativescript doc for project setup: https://docs.nativescript.org/environment-setup.html

## Usage

``` bash
# Install dependencies
npm install

# Build for production
tns build <platform> --bundle

# Build, watch for changes and debug the application
tns debug <platform> --bundle

# Build, watch for changes and run the application
tns run <platform> --bundle
```
