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
    """

    def name(self):
        return 'action_get_balance'
    
    def run(self, dispatcher, tracker, domain):
        userAddress = tracker.get_slot('userAddress')
        if userAddress:
            balance = 1000 # API HERE
            dispatcher.utter_message('Số dư của tài khoản ' + userAddress + ' là: ' + str(balance))
        else:
            dispatcher.utter_message('Có lỗi xảy ra, bạn vui lòng thực hiện lại yêu cầu nhé! :(')
        return []

        
# Test function
class ActionBookSearchName(Action):
    """
    Find book by its name.
    """

    def name(self):
        return 'action_book_search_name'

    def run(self, dispatcher, tracker, domain):
        if tracker.get_slot('book_name'):
            book_name = tracker.get_slot('book_name')
            print('book name: ' + book_name)
        else:
            dispatcher.utter_message('Hong tìm ra quyển sách với tên bạn cần :(')
        return []

# Test function
class ActionBookSearchGenre(Action):
    """
    Find books by its genre.
    """

    def name(self):
        return 'action_book_search_genre'

    def run(self, dispatcher, tracker, domain):
        if tracker.get_slot('book_genre'):
            book_genre = tracker.get_slot('book_genre')
            print('book genre: ' + book_genre)
        else:
            dispatcher.utter_message('Hong tìm ra quyển sách thể loại bạn cần :(')
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
