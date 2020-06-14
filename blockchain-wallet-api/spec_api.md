# Blockchain wallet API
**Description**
----
This Blockchain's API is supporting Bitcoin(BTC), Bitcoin Cash(BCH), Litecoin, ZCash, Ripple, Ethereum

* URL to call API : `http://localhost/{NETWORK}`
* The API below requires you to specify the _NETWORK_ when use the API. The  NETWORK acronyms are as follows:

| Blockchain |  (Network) Acronym  | Info  |
| ------------- |:-------------:| :-----|
| Bitcoin      | BTC | The Bitcoin network. |
| Bitcoin Cash      | BCH      |   The Bitcoin cash network |
| Litecoin | LTC      |    The Litecoin network |
| Zcash | ZEC      |    The Zcash network |
| Ethereum | ETH      |    The Ethereum network |
| Ripple | XRP      |    The Ripple network |


* Transaction Fee (1 input 1 output)

| Blockchain 	| txFee 				|
| ------------- |:---------------------:|
| Bitcoin      	| 0.00004032 BTC 		|
| Bitcoin Cash  | 0.00000192 BCH	 	|
| Litecoin 		| 0.001 LTC				|
| Zcash 		| 0.0001 ZEC	 		|
| Ripple  		| 0.00001 XRP  			|


| Blockchain    | gasPrice              | gasLimit              |
| ------------- |:---------------------:|:---------------------:|
| Ethereum      | 0.00000004 ETH        | 21000                 |

**Get User Balance**
----
  Returns json data about user's balance.

* **URL:**  `/user/balance/{address}`

* **Method:**  `GET`

* **Success Response:**

  * **Code:** 200
  *  **Content:**
    ```json
    {   
        status : "success",
        message : {
    		"network" : "BTC",
    		"address" : "DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1",
    		"balance" : "0.09438376"
		    }
	}
	```

  If unconfirmed balance != 0, applied for those use UTXO
  ```json
  {   
      status : "success",
      message : {
        "network" : "BTC",
        "address" : "DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1",
        "balance" : "0.09438376",
        "unconfirmedBalance" : "-0.000658"
      }
  }
  ```

* **Error Response:**

  * **Code:** 404 NOT FOUND
  *  **Content:**
    ```{ error : "User doesn't exist" }```


* **Sample Call:**

  ```javascript
	fetch("https://localhost:3003/BTC/user/balance/DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1",  {
		method:  "get",
		headers:  {  "Content-Type":  "application/json"  },
	})
	.then(res  =>  res.json())
	.then(json  =>  console.log(json));
  ```


**Send transaction**
----
  Broadcast transaction to the correspondent Blockchain

* **URL :**   `/transaction/send`

* **Method:** `POST`

* **Data Params**

	**Required:**
	* privateKey : string
	* senderAddress : string
	* amount : string
	* destinationAddress : string
	* txFee  : string (unit currency, not for ETH)
	* gasLimit : string (only for ETH)
	* gasPrice : string (only for ETH)
	* message : string (optional)
	* memo : string (optional)
	* destinationTag : string (optional)
	* paymentID : string (optional)

* **Success Response:**

  * **Code:** 200 <br />
  *  **Content:**
	```json
	  {
		  status : "success",
		  message : {
		    network : "BTC",
			  txId : "304a58751ee08b7a79915a2139be44a819a39d22a4822d41139afdb22a839451"
		  }
	  }
	```

* **Error Response:**

  * **Code:** 404 NOT FOUND
  *  **Content:** `{ error : "" }`


* **Sample Call:**

  ```javascript
	const  body  =  {
		privateKey: "Kzy6JCQYunQGYWVof8AGNBxwZbKsyUUCUEUzRHMmJtyZy5h2msq9",
		senderAddress : "bchtest:qqruay09rurmwzd0p0x0v7mwysje3jfp4s8aeusa9t",
		amount : "0.0001",
		destinationAddress : "bchtest:qqruay09rurmwzd0p0x0v7mwysje3jfp4s8aeusa9t"   
	};
	fetch("https://localhost:3003/BCH/transaction/send",  {
		method:  'post',
		body:  JSON.stringify(body),
		headers:  {  'Content-Type':  'application/json'  },
	})
	.then(res  =>  res.json())
	.then(json  =>  console.log(json));
  ```

**Get Transaction**
----
  return json data about transaction's information

* **URL :** `/transaction/info/{txID}`

* **Method:**  `GET`

* **Success Response:**

  * **Code:** 200
  * **Content:**
    ```
    {
	    "network" : string,
	    "txID" : string,
	    "time" : date,
      	"confirmation" : string, (optional)
      	"blockhash" : string, (optional)
      	"blocknumber" : string, (optional)
	    "inputs" : [ ... ], (optional, utxo)
	    "outputs" : [ ... ], (optional, utxo)
      	"outcome" : [ ... ], (optional, ripple)
	}
    ```

* **Error Response:**

  * **Code:** 404 NOT FOUND
  *  **Content:** `{ error : "" }`

* **Sample Call:**
  ```
	fetch("https://localhost:3003/BTC/transaction/6f47f0b2e1ec762698a9b62fa23b98881b03d052c9d8cb1d16bb0b04eb3b7c5b",  {
		method:  "get",
		headers:  {  "Content-Type":  "application/json"  },
	})
	.then(res  =>  res.json())
	.then(json  =>  console.log(json));
  ```



  * **Error Response:**

	   * **Code:** 404 NOT FOUND
	   * **Content:**
	```json
       { error : "" }
	```

 * **Sample Call:**

  ```javascript
	fetch('https://localhost:3003/BCH/transaction/fee',  {
		method:  'get',
		headers:  {  'Content-Type':  'application/json'  },
	})
	.then(res  =>  res.json())
	.then(json  =>  console.log(json));
  ```


  **Generate Address**
  ----
   Generate address for users

  * **URL:** `/user/address/generate`

  * **Method:** `GET`
  * **Success Response:**

    * **Code:** 200
    *  **Content:**
      ```json
	    {
		    status : "success",
		    message : {
		        network   : "BTC",
		        privateKey: "0x2cbe7d0839c32f055e37ffe957ee375f757bc81491b7362a5692a0a0b6fc5526",
                address   : "0x443BD8055208DA7a93E60D1737F2AFD230e68AFe",

		  	}
  		}
	  ```

  * **Error Response:**

    * **Code:** 404 NOT FOUND
    * **Content:** `{ error : "" }`


  * **Sample Call:**

  ```javascript
	fetch('https://localhost:3003/BCH/user/address/generate',  {
		method:  'GET',
		headers:  {  'Content-Type':  'application/json'  },
	})
	.then(res  =>  res.json())
	.then(json  =>  console.log(json));
  ```
