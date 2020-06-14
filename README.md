# Follow the below instructions to run chat bot
## Set up API

Make sure you have [installed Node.js](https://nodejs.org/en/download/) 0.10 or higher


Inside the blockchain-wallet-api, run the following code to install dependencies 
```bash
$ npm install
```


To stop server: Ctrl + C


View the website of Server API at: http://localhost:3003

### BTC test 

Address : 1gzm7L4GNbNDUkfWZxQJdZt6b7tjoWzRb
Tx_id: 5ac821aea2bec5c8deb8dbbbab2dbf4c40ea89e7b412fe999a8d5080459ca4af


### ETH test net

Admin account Test:
"message": {
        "network": "ETH",
        "address": "0x9fd32A78Cc1Aa71CBe2aF06e47e3F6D0e9951b5F",
        "privateKey": "97dfd42268314aeae3cc677dcfd3b59e57fd4de030a1cc26807508f8ba808a82"
}

User account Test:
"message": {
        "network": "ETH",
        "address": "0x097fa3d6301dF93f2088300490e29F8Bc22aec91",
        "privateKey": "aa96f903e71f0204cd45b4298428760a1a0d70165059aab0abcbc7ee003cc3f0"
}


## Set up Database

Open DatabaseConnector.py and specify the following information at line 4-10

```
####################### DATABASE #######################
DATABASE    = 'your database name'
HOST        = 'your host' 
PORT        =  your port
USER_NAME   = 'your username'
PASSWORD    = 'your password'
########################################################
```

### Database name
```
DATABASE    = 'your database name'
```
Database name to which you want to connect. Note that you must type the name as a string.

### Host and Port
```
HOST        = 'your host' 
PORT        =  your port
```
Host:
* The server name or Ip address on which PostgreSQL is running.
* If you are running on localhost, then you can use localhost, or it’s IP i.e., 127.0.0.0.

Port:
* The port number to connect to the database
* The default port of Postgresql is 5432
Note that Host is a string and Port is a number.

### Username and Password

```
USER_NAME   = 'your username'
PASSWORD    = 'your password'
```
The username and password you use to work with PostgreSQL.
The default username and password for the PostgreSQL database is postgres
Note that both username and password are strings.

## Create sample database

Make sure you have installed postgresql

Open terminal in folder create_database and run the following lines

```bash
$ psql -U postgres
```

Enter password for your postgresql

```
\i createDb.sql
\c Chatbot_ecommerce
\i createTable.sql
\i insertSampleValues.sql
```

Sample values can be changed in insertSampleValues.sql

## Train Rasa

Train rasa with the following code:

```bash
$ rasa train
```

Start the API server in another terminal:

```bash
$ npm start
```


Start the actions server in another terminal:

```bash
$ rasa run actions
```


Start to chat with the bot:

```bash
$ rasa shell
```