# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


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
            balance = 1000 # API for getting user's balance here
            dispatcher.utter_message('Số dư của tài khoản ' + userAddress + ' là: ' + str(balance))
        else:
            dispatcher.utter_message('Có lỗi xảy ra, bạn vui lòng thực hiện lại yêu cầu nhé! :(')
        return []

        
# Test function
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
            print('book name: ' + bookName)
        else:
            dispatcher.utter_message('Hong tìm ra quyển sách với tên bạn cần :(')
        return []

# Test function
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
            transactionInfo = "<Transaction Info>" # API for getting transaction info based on transaction ID here
            dispatcher.utter_message('Thông tin giao dịch với ID ' + transactionId + ' là ' + transactionInfo)
        else:
            dispatcher.utter_message('Có lỗi xảy ra, bạn vui lòng kiểm tra hoặc thực hiện lại yêu cầu nhé! :(')
        return []



#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
