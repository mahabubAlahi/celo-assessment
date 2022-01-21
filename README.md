# Celo Assessment
This API accepting a 40 character hexadecimal string as a public
address, Celo network type and fiat currency as query parameters. It retrives token transfer information for Celo Punks, Moo Punks and Celo Apes nfts corresponding to the address.

# Sample Request & Response
The query param migth look like this-
```
?address=0x45aae76094ac2579123f8f3d2d4315842e77b21c (require)
?network=main (Supported value: main/alfajores) (Optional Param)
?currency=usd (Supported value usd, brl(brazilian real) and euro) (Optional Param)
```
The response will look like this-
```
{
    "message": "Successfully fetch Information from Celo Punks, Celo Apes, Moo Punks NFT",
    "result": {
        "tokenTransactionInfo": [
            {
                "nftName": "Celo Punks",
                "tokenName": "Celo native asset",
                "tokenTransferred": "CELO",
                "amount": 25,
                "marketValue": 97.75,
                "date": "2022-01-13"
            },
            {
                "nftName": "Celo Punks",
                "tokenName": "Celo native asset",
                "tokenTransferred": "CELO",
                "amount": 11,
                "marketValue": 43.010000000000005,
                "date": "2022-01-13"
            },
            {
                "nftName": "Celo Apes",
                "tokenName": "Celo native asset",
                "tokenTransferred": "CELO",
                "amount": 9,
                "marketValue": 35.19,
                "date": "2021-11-04"
            },
            {
                "nftName": "Celo Punks",
                "tokenName": "Celo native asset",
                "tokenTransferred": "CELO",
                "amount": 12.4,
                "marketValue": 48.484,
                "date": "2022-01-13"
            },
            {
                "nftName": "Celo Punks",
                "tokenName": "Celo native asset",
                "tokenTransferred": "CELO",
                "amount": 12.625,
                "marketValue": 49.36375,
                "date": "2022-01-13"
            },
            {
                "nftName": "Moo Punks",
                "tokenName": "Celo native asset",
                "tokenTransferred": "CELO",
                "amount": 14,
                "marketValue": 54.74,
                "date": "2021-11-14"
            },
            {
                "nftName": "Celo Punks",
                "tokenName": "Celo native asset",
                "tokenTransferred": "CELO",
                "amount": 20.2,
                "marketValue": 78.982,
                "date": "2022-01-12"
            },
            {
                "nftName": "Celo Punks",
                "tokenName": "Celo native asset",
                "tokenTransferred": "CELO",
                "amount": 7.920792079207921,
                "marketValue": 30.97029702970297,
                "date": "2022-01-11"
            }
        ]
    },
    "status": 1
}
```
# Additional Notes
* Query param network value only supports 'main' and 'alfajores'.
* Query param currency value only supports 'usd', 'brl' and 'euro'
* Query param address is require to call the api, network and currency param are optional.

# Build Instructions
* Clone the git repo by running the following command in your terminal -
```
git clone https://github.com/mahabubAlahi/celo-assessment.git
```
* Run the following command to install the dependencies -
```
npm install
```
* Now checkout to the dev branch by the following command- 
```
git checkout dev
```
because I intentionally added `.env` file in the dev branch for easier local testing.
For master branch, create your own `.env` from `.env.example` file
* Run the project -
```
npm start
```
* This the GET API and the URL for sending the request-
```
http://localhost:[Port]/api/celo-trans-info?address={address}&network={network}&currency={currency}
```

# Deployment
The project is deployed in `Heroku` Server. Here is the Deployed API Url -
```
https://celo-assessment.herokuapp.com/api/celo-trans-info?address={address}&network={network}&currency={currency}
```