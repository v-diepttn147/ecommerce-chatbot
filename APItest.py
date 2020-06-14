import requests
import base64

# Testing with BTC coin

BookSearch = None 

server = "http://localhost:3003"

# mac dinh server still alive

def authentication(user_name: str, pass_word: str, url : str):
    bUser = (user_name + ':' + pass_word).encode('ascii')
    payload = {}
    headers = {
        'Authorization': 'Basic ' + base64.b64encode(bUser).decode('utf8')
    }
    response =  requests.request("GET", url, headers=headers, data = payload)
    return not "status" in response.json()

def generateAddress(user_name: str, pass_word: str, url : str, coin : str):
    url = url + "/"+ coin +"/user/address/generate"
    bUser = (user_name + ':' + pass_word).encode('ascii')
    payload = {}
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.b64encode(bUser).decode('utf8')
    }
    response =  requests.request("GET", url, headers=headers, data = payload)
    rjson = response.json()
    if 'status' in  rjson:
        return rjson if rjson['status'] == "success" else None 
    return None

def getTransaction(user_name: str, pass_word: str, transID :str , url : str, coin: str):
    url = url + "/"+ coin +"/transaction/info/" + transID
    bUser = (user_name + ':' + pass_word).encode('ascii')
    payload = {}
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.b64encode(bUser).decode('utf8')
    }
    response =  requests.request("GET", url, headers=headers, data = payload)
    rjson = response.json()
    if 'status' in  rjson:
        return rjson if rjson['status'] == "success" else None
    return None

def getBalance(user_name: str, pass_word: str, address :str , url : str, coin: str):
    url = url + "/" + coin + "/user/balance/" + address
    bUser = (user_name + ':' + pass_word).encode('ascii')
    payload = {}
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.b64encode(bUser).decode('utf8')
    }
    response =  requests.request("GET", url, headers=headers, data = payload)
    rjson = response.json()
    if 'status' in  rjson:
        return rjson if rjson['status'] == "success" else None
    return None

def send(user_name: str, pass_word: str, adr_send :str, adr_receive: str, private_key: str ,amount: float ,url : str, coin: str):
    # Now only for ETH
    url = url + "/" + coin + "/transaction/send"
    bUser = (user_name + ':' + pass_word).encode('ascii')
    #payload = 'amount='+ str(amount) +'&senderAddress='+ adr_send +'&privateKey='+ private_key +'&destinationAddress='+adr_receive+'&txFee=0.0000001'
    # payload for ETH
    payload = 'senderAddress='+ adr_send  +'&destinationAddress=' + adr_receive +'&amount=' + str(amount) + '&gasPrice=0.000000001&gasLimit=21000&privateKey=' + private_key
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64.b64encode(bUser).decode('utf8')

    }
    response =  requests.request("POST", url, headers=headers, data = payload)
    rjson = response.json()
    return rjson

# if __name__ == '__main__':
#     # Tat ca deu phai duoc authen truoc khi goi(can user_name va pass word)
#     server = server 
#     user_name = 'teamapi'
#     pass_word = 'Teamapi@2019'
#     TX_ID = '0xa34e95aa656b485da6aa2e0854e6b032c47dbbd661041b51ec35b2ff2d4620cc'
#     Address = '0x097fa3d6301dF93f2088300490e29F8Bc22aec91'
#     private_key = 'aa96f903e71f0204cd45b4298428760a1a0d70165059aab0abcbc7ee003cc3f0'
#     receive_adr = '0x9fd32A78Cc1Aa71CBe2aF06e47e3F6D0e9951b5F'
#     coin = "ETH"
#     # test generateNewAddress

#     #print(generateAddress(user_name, pass_word, server, coin))
#     print('\n')

#     # test getUserBalance

#     #print(getbalance(user_name, pass_word, Address, server, coin))
#     print('\n')
#     # test getTransaction

#     #print(gettransaction(user_name, pass_word, TX_ID, server, coin))

#     print(send(user_name, pass_word, Address, receive_adr, private_key, 0.5 ,server, coin))