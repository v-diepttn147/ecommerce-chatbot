# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"
import json

from rasa_sdk.forms import FormAction, REQUESTED_SLOT
from rasa_sdk import ActionExecutionRejection
from typing import Any, Text, Dict, List, Union
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import AllSlotsReset
import DatabaseConnector
from APItest import generateAddress, getBalance, getTransaction, send
import APItest

user_name = 'teamapi'
pass_word = 'Teamapi@2019'
server = 'http://localhost:3003'
coin = "ETH"
admin_addr = "0x9fd32A78Cc1Aa71CBe2aF06e47e3F6D0e9951b5F"

'''
#######Book name with key (Dict)

# Chỗ này chỉ dùng để test khi chưa có database
Books = {}
BooksList = ['Harry Potter Và Hòn Đá Phù Thủy','Phía Sau Nghi Can X','Rừng Na Uy','Người Về Từ Sao Hỏa','Giết Con Chim Nhại',
'To Kill A Mocking Bird','Steve Jobs','Lâu Đài Bay Của Pháp Sư Howl','Introduction to Python','Yêu Những Điều Không Hoàn Hảo',
'Sapiens: Lược Sử Loài Người','21 Bài Học Cho Thế Kỷ 21', 'Ông Trăm Tuổi Trèo Qua Cửa Sổ Và Biến Mất','5099 Từ Vựng HSK1 – HSK6',
'Khi Hơi Thở Hóa Thinh Không']
BooksKey= ['58094cc5-5c80-4964-8a78-b40d997a47f0', '70179e96-619b-4fcf-af0e-b4de2902b174', '150baa90-792d-4b63-9baf-fb5c349acff6', 
'31e471f8-4ba0-4647-a423-47f469260ec4', 'bb9bf80d-8794-4ae4-9e38-795c030a2d23', '00f94a2d-2752-44c5-90da-6dddce249bb5', 
'40b45837-3790-429f-b1a6-501d807387f0', '0763b687-e018-45a1-b081-49b836e2a472', '79f412ad-77a7-4dfd-b2c3-a2eeb2d42f34', 'f394ada8-6348-448e-8e08-9041b006e514', 
'508a7aa2-d0f5-492c-85df-0203edfc659b', '77f3ae6b-7bde-49bb-81f4-4f097f7bd298', '6bde779d-06fa-47d5-8924-e4bc6ed9a146', '7c6b5bea-245d-457e-9ebb-a77f3dda98b8', 
'fbcd687b-2924-4d5d-a742-4508aec8db55']

for book, key in zip(BooksList, BooksKey):
    Books[book] = key
############
'''


class ActionGetBalance(Action):
    """
    Get User Balance (userAddress): Yêu cầu xem số dư tài khoản dựa trên địa chỉ cung cấp.
    params: userAddress
    """

    def name(self):
        return 'action_get_balance'
    
    def run(self, dispatcher, tracker, domain):
        userAddress = tracker.get_slot('userAddress')
        if userAddress:
            balance = getBalance(user_name, pass_word, userAddress, server, coin)            
            dispatcher.utter_message('Tài khoản có địa chỉ ' + userAddress + ' có số dư là:' + balance['message']['balance'] + ' ' + balance['message']['network'] + '.\nMình có thể giúp gì nữa không?')
        else:
            dispatcher.utter_message('Có lỗi xảy ra, bạn vui lòng thực hiện lại yêu cầu nhé! :(')
        return [AllSlotsReset()]

 
class GetTransaction(Action):
    """
    Get transaction information
    params: transactionId
    """
    def name(self):
        return 'action_get_transaction_info'
    
    def run(self, dispatcher, tracker, domain):
        transactionId = tracker.get_slot('transactionId')
        if transactionId:
            res = getTransaction(user_name, pass_word, transactionId, server, coin)
            if coin == "BTC":
                init_trans = {"txid" : transactionId, "SenderAddress" : None, "ReceiverAddress" : None, "total" : 0, "fee" : 0}
                if not res or"error" in res:
                    dispatcher.utter_message("Không tồn tạo giao dịch với số giao dịch là " + str(transactionId))
                else:
                    if "status" in res and res["status"] == 'success':
                        init_trans["SenderAddress"] = res["message"]["address"][1]
                        init_trans["ReceiverAddress"] = res["message"]["address"][0]
                        init_trans["total"] = res["message"]["total"]
                        init_trans["fee"] = res["message"]["fees"]
                    transactionInfo = json.dumps(init_trans)
                    dispatcher.utter_message('Thông tin giao dịch với ID ' + transactionId + ' là ' + transactionInfo)
            elif coin == "ETH":
                init_trans = {"txid" : transactionId, "SenderAddress" : None, "ReceiverAddress" : None, "value" : 0, "Gas" : 0}
                if not res or "error" in res:
                    dispatcher.utter_message("Không tồn tạo giao dịch với số giao dịch là " + str(transactionId))
                else:
                    if "status" in res and res["status"] == 'success':
                        init_trans["SenderAddress"] = res["message"]["inputs"][0]["from_address"]
                        init_trans["ReceiverAddress"] = res["message"]["outputs"][0]["to_address"]
                        init_trans["value"] = res["message"]["outcome"][0]["value"]
                        init_trans["Gas"] = res["message"]["outcome"][0]["gasPrice"]
                    transactionInfo = json.dumps(init_trans)
                    dispatcher.utter_message('Thông tin giao dịch với ID ' + transactionId + ' là: ' + '\n' +  "Địa chỉ của người gửi là " + init_trans['SenderAddress'] + '\n' + "Địa chỉ của người nhận là " + init_trans['ReceiverAddress'] + '\n' + "Số tiền giao dịch là " + init_trans['value'] + "ETH" + '\n' + 'Mình có thể giúp gì nữa không?')
        else:
            dispatcher.utter_message('Có lỗi xảy ra, bạn vui lòng kiểm tra hoặc thực hiện lại yêu cầu nhé! :(')
        return [AllSlotsReset()]

class GenerateAddress(Action):
    """
    Generate Address
    params: None
    """
    def name(self):
        return 'action_gen_address'

    def run(self, dispatcher, tracker, domain):
        res = generateAddress(user_name, pass_word, server, coin)
        dispatcher.utter_message('Tài khoản của bạn đã được tạo trên mạng ' + res['message']['network'] + '\n'+'Địa chỉ mới của bạn là '+ res['message']['address'] + '\n' +'Khóa riêng của bạn là ' + res['message']['privateKey'] + ' vui lòng giữ khóa riêng bí mật' + '\n' + 'Mình có thể giúp gì nữa không?')
        return []


class TransactionForm(FormAction):
    """Collects transaction information and adds it to the spreadsheet"""

    ### Notices: Exceptions for unexpected inputs are not handles yet!!

    def name(self):
        return "transaction_form"

    @staticmethod
    def required_slots(tracker):
        return ["senderAddress", "destAddress", "privateKey", "amount"]

    def submit(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict]:
        """
        Define what the form should do after all information are collected
        """

        dispatcher.utter_message("Mình đã nhận được thông tin của bạn, giao dịch sẽ được hoàn tất trong chốc lát :)")
        senderAddress = tracker.get_slot('senderAddress')[3:]
        destAddress = tracker.get_slot('destAddress')[3:]
        privateKey = tracker.get_slot('privateKey')
        amount = tracker.get_slot('amount')[3:]
  
        # call API
        res = send(user_name, pass_word, senderAddress, destAddress, privateKey, amount, server, coin)
        
        dispatcher.utter_message("Giao dịch với thông tin: " + "\n" +  "Địa chỉ của người gửi là " + senderAddress + '\n' + "Địa chỉ của người nhận là " + destAddress + '\n' + "Số tiền giao dịch là " + amount + "ETH" + '\n' + 'Giao dịch thành công. Mã giao dịch là ' + res['message']['txid'])

        # If this is a transaction for purchasing book: return the book key using book isbn
        if tracker.get_slot('isbn'):
            isbn = tracker.get_slot('isbn')
            transactionId = res['message']['txid']
            res = getTransaction(user_name, pass_word, transactionId, server, coin)
            if coin == "ETH":
                if not res or "error" in res:
                    dispatcher.utter_message("Không tồn tại transaction này, vui lòng kiểm tra lại")
                else:
                    if "status" in res and res["status"] == 'success':
                        ReceiverAddress = res["message"]["outputs"][0]["to_address"]
                        value = res["message"]["outcome"][0]["value"]
                        ######### QUERY HERE: search book key using isbn
                        key = DatabaseConnector.getKeyByISBN(isbn)
                        if ReceiverAddress.lower() == admin_addr.lower() and float(value) >= 0.00000001:
                            dispatcher.utter_message( "Key book bạn đã mua: " + key)
                        else:
                            dispatcher.utter_message('Địa chỉ gửi sai hoặc giá không đúng')
                    else:
                        dispatcher.utter_message('Không tồn tại transaction này, vui lòng kiểm tra lại ')

        return [AllSlotsReset()]
    
    def slot_mappings(self) -> Dict[Text, Union[Dict, List[Dict[Text, Any]]]]:
        """A dictionary to map required slots to
        - an extracted entity
        - intent: value pairs
        - a whole message
        or a list of them, where a first match will be picked"""
        return {"use_case": self.from_text(intent="inform")}
        

       
class ActionBookSearchName(Action):
    """
    Find book by its name.
    params: bookName
    """

    def name(self):
        return 'action_book_search_name'

    def run(self, dispatcher, tracker, domain):
        if tracker.get_slot('book_name'):
            bookName = tracker.get_slot('book_name')
            ################
            bookList = DatabaseConnector.getAllBookInfo(title=bookName)
            message = DatabaseConnector.listbook2json(bookList)
            if bookList == []:
                message = 'Không tìm thấy sách ' + bookName
            else:
                dispatcher.utter_message(message)
                dispatcher.utter_message("Bạn hãy cho mình biết số ISBN của quyển sách bạn muốn mua nhé!")
            ################
        else:
            dispatcher.utter_message('Bạn có thể nhập lại tên không ạ?')
        return [AllSlotsReset()]


class ActionBuyBook(Action):
    """
    Receive the book's ISBN and return the admin address and the book's important information
    param: isbn
    return: admin addressId (at the moment return only one admin address for testing)
            book name & author
            book price
    """
    def name(self):
        return "action_buy_book_with_isbn"
    
    def run(self, dispatcher, tracker, domain):
        if tracker.get_slot('isbn'):
            isbn = tracker.get_slot('isbn')
            ##############
            # testing
            bookList = DatabaseConnector.getAllBookInfo(ISBN=isbn) #search book using isbn
            if bookList == []:
                dispatcher.utter_message('Bạn có thể nhập lại ISBN không ạ?')
            else:
                adminAddress = '0x9fd32A78Cc1Aa71CBe2aF06e47e3F6D0e9951b5F'
                dispatcher.utter_message(DatabaseConnector.listbook2json(bookList))
                dispatcher.utter_message('\nVui lòng thực hiện chuyển khoản cho Admin(địa chỉ: {0}) để mua sách bạn nhé!'.format(adminAddress))
            # QUERY HERE: search book using isbn
            #############
        else:
            dispatcher.utter_message('Bạn có thể nhập lại ISBN không ạ?')
        return []

class ActionSendFile(Action):
    """
    Action to call API for sending and saving file from user, then return the value True or False
    True if sending and saving file successfully else False
    """
    def name(self):
        return "action_send_file"

    def run(self, dispatcher, tracker, domain):
        ################# START API HERE #############
        '''
        isSuccess is a boolean variable assigned to the value which is returned by the API, either True or False
        '''
        isSuccess = True # set True for testing purpose, you will need to replace the value which is returned by calling APIs
        ################ END API HERE ################

        if isSuccess:
            dispatcher.utter_message('Gửi tệp tin thành công!')
        else:
            dispatcher.utter_message('Có lỗi xảy ra, xin vui lòng kiểm tra và thử lại!')
        return []


############# Test function DON'T USE THIS ###################
class ActionCheckBookKey(Action):
    """
    Receive a transaction ID and check if this is a valid transaction for buying book
    param: transactionId
    return: book_key (if available)
    """
    def name(self):
        return 'action_check_book_key'

    def run(self, dispatcher, tracker, domain):
        transactionId = tracker.get_slot('transactionId')
        if transactionId:
            res = getTransaction(user_name, pass_word, transactionId, server, coin)
            if coin == "ETH":
                if "error" in res:
                    dispatcher.utter_message("Không tồn tại transaction này, vui lòng kiểm tra lại")
                else:
                    if "status" in res and res["status"] == 'success':
                        ReceiverAddress = res["message"]["outputs"][0]["to_address"]
                        value = res["message"]["outcome"][0]["value"]
                        # print(ReceiverAddress)
                        # print(value)
                        # Book = APItest.BookSearch
                        # print(Book)
                        # if ReceiverAddress.lower() == admin_addr.lower() and float(value) >= 0.01:
                        #     dispatcher.utter_message( "Keys book bạn đã mua :  " + Books[Book])
                        # else:
                        #     dispatcher.utter_message('Địa chỉ gửi sai hoặc giá không đúng')
                    else:
                        dispatcher.utter_message('Không tồn tại transaction này, vui lòng kiểm tra lại ')
                        
        else:
            dispatcher.utter_message('Có lỗi xảy ra, bạn vui lòng kiểm tra hoặc thực hiện lại yêu cầu nhé! :(')
        return [AllSlotsReset()]

class ActionBookSearchGenre(Action):
    """
    Find books by its genre.
    params: book genre
    """

    def name(self):
        return 'action_book_search_genre'

    def run(self, dispatcher, tracker, domain):
        if tracker.get_slot('book_genre'):
            bookGenre = tracker.get_slot('book_genre')
            print('book genre: ' + bookGenre)
        else:
            dispatcher.utter_message('Hong tìm ra quyển sách thể loại bạn cần :(')
        return []

