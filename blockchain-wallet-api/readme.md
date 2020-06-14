
![BLockchain Logo](https://techtalk.vn/wp-content/uploads/2019/05/blockchain-696x522.png)

## Content

1. Architecture
2. Installation
3. Quick start
4. Install Dependencies
5. Some special Notes with Cryptocurrency

## Architecture

in `app.js` file, there is a general route, which will call corresponding module with appropriate path `/BCH` or `/BTC` , ...

 - In general, the packet first will go to app.js
 - Then, base on URL ( network blockchain ) , the packet will move to corresponding route folder
 - After that, base on method (GET, POST ) and end-point API, it will call appropriate function
 -
### folder routes  
this folder will have 7 javascript files relating to 7 network ( BTC, BCH , ... ) , and end-point API will be defined in those files.
There are two method that is usually used in this application :
	* `GET`  
    * `POST`

for example :

```javascript
const express    = require("express");
const router     = express.Router();
const controller = require('../controllers/bitcoinControllers');

router.post("/transaction/send",controller.sendTransaction);

router.get("/transaction/fee", controller.getTransactionFee);

router.get("/transaction/info",controller.getTransaction);

router.get("/user/balance",controller.getUserBalance);

router.get("/user/address/generate",controller.getUserAddress);

module.exports = router;
```
### folder controllers  
The specific functions will be implemented in this folder
```javascript
module.exports = {
  sendTransaction : (req,res,next) => {

  },
  getTransaction : (req,res,next) => {

  },
  getTransactionFee : (req,res,next) => {

  },
  getUserBalance : (req,res,next) => {

  },
  getUserAddress : (req,res,next) => {

  },
}

```

### folder config
this config contains environment variables which are used across the application
* `url_blockchain.js` : this file holds the URL of all blockchain site ( use have to go to this folder to update your blockchain's URL )
* ... in the future, this folder may get expand more


## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):


Follow [our installing guide](http://expressjs.com/en/starter/installing.html)
for more information.

## Quick Start

  Install dependencies:

```bash
$ npm install
```

  Start the server:

```bash
$ npm start
```

  View the website at: http://localhost:3003
* `ctrl + s` , the server will automatically save and update


## install dependencies

When you would like to install new module into the project, you should use :

`npm install --save MODULE_NAME`

`--save` : is to save that module into the project, if you do not use this, the module will be installed only in your laptop/PC. Thus, when you push it to Gitlab, it will crash the application

for example : `npm install --save bitcore-lib`


### Some special Notes with Cryptocurrency

BitcoinCash
* Bitcoin cash is a fork of bitcoin core (bitcoin) so it has 2 type of addresses which are legacy address and cash address
  * legacy address is the address having Bitcoin address's format. For example : `1G7D22rqzGL1Z3Kv3VCG74KKDJ9gVgwtsA`
  * Cash address is the address using mostly in Bitcoin Cash network. For example : `bitcoincash:qzjmv6smy4h2dfvc904e6my0e4chgemasscpykdsdd`

* We can either use legacy address or cash address
