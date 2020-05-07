# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"

from rasa_sdk.forms import FormAction, REQUESTED_SLOT
from rasa_sdk import ActionExecutionRejection
from typing import Any, Text, Dict, List, Union
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import AllSlotsReset


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
            transactionInfo = "<API HERE: Transaction Info...>" # API for getting transaction info based on transaction ID here
            dispatcher.utter_message('Thông tin giao dịch với ID ' + transactionId + ' là ' + transactionInfo)
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
        dispatcher.utter_message('<API HERE: Tài khoản của bạn đã được tạo ....>')
        return []

# class SendTransaction(Action):
#     """
#     Send Transaction
#     params: senderAddress, destinationAddress, privateKey, amount
#     """
#     def name(self):
#         return 'action_send_transaction'
    
#     def run(self, dispatcher, tracker, domain):
#         senderAddressRaw = tracker.get_slot('senderAddress')
#         destAddressRaw = tracker.get_slot('destAddress')
#         privateKeyRaw = tracker.get_slot('privateKey')
#         amountRaw = tracker.get_slot('amount')
#         if senderAddressRaw and destAddressRaw and privateKeyRaw and amountRaw:
#             senderAddress = senderAddressRaw[3:]
#             destAddress = destAddressRaw[3:]
#             privateKey = privateKeyRaw[3:]
#             amount = amountRaw[3:]
#             # Call API here
#             dispatcher.utter_message('Yêu cầu của bạn đã được thực hiện thành công')
#         else:
#             dispatcher.utter_message('Có lỗi xảy ra, bạn hãy kiểm tra lại để chắc chắn rằng đã cung cấp đủ các thông tin : địa chỉ người gửi, địa chỉ người nhận, private key và số lượng tiền muốn chuyển nhé!')
#         return []

class TransactionForm(FormAction):
    """Collects transaction information and adds it to the spreadsheet"""

    ### Notices: Exceptions for unexpected inputs are not handles yet!!

    def name(self):
        return "transaction_form"

    @staticmethod
    def required_slots(tracker):
        return ["senderAddress", "destAddress", "privateKey", "amount"]
    
    # async def validate(self, dispatcher, tracker, domain):
    #     try:
    #         # return super().validate(dispatcher, tracker, domain)
    #         print('ok hẻe')
    #     except ActionExecutionRejection:
    #         # could not extract entity
    #         dispatcher.utter_message(
    #             "Sorry, I could not parse the value correctly. \n"
    #             "Please double check your entry otherwise I will ask you this forever"
    #         )
    #     finally:
    #         print('ok')
    #     return []

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
        amount = tracker.get_slot('amount')
        print(senderAddress)
        print(destAddress)
        print(privateKey)
        print(amount)

        ###########################
        # API here
        ###########################
        # print(tracker.get_slot(REQUESTED_SLOT))
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
            ## query here ##
            ################
            dispatcher.utter_message('Thông tin về cuốn ' + bookName)
        else:
            dispatcher.utter_message('Bạn có thể nhập lại tên không ạ?')
        return [AllSlotsReset()]

############# Test function ###################
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

