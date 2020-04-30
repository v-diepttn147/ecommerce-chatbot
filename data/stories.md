## greet
* greet
  - utter_greet

## introduce
* introduce
  - utter_bot
  - utter_can_do

## search_book_name
* book_search_name
  - action_book_search_name

## search_book_genre
* book_search_genre
  - action_book_search_genre

## get balance 1
* get_balance
  - utter_get_balance
* give_userAddress
  - utter_confirm
  - action_get_balance

## get balance 2
* give_userAddress
  - utter_is_get_balance
* user_confirm
  - utter_confirm
  - action_get_balance

## get balance 3
* give_userAddress
  - utter_is_get_balance
* user_deny
  - utter_fine

## get balance 4
* get_balance_with_userAddress
  - utter_confirm
  - action_get_balance

## get transaction 1
* get_transaction_info
  - utter_get_transaction_info
* give_transaction_info
  - utter_confirm
  - action_get_transaction_info

## get transaction 2
* give_transaction_info
  - utter_is_get_transaction_info
* user_confirm
  - utter_confirm
  - action_get_transaction_info

## get transaction 3
* give_transaction_info
  - utter_is_get_transaction_info
* user_deny
  - utter_fine

## get transaction 4
* get_transaction_info_with_transactionId
  - utter_confirm
  - action_get_transaction_info

## say thanks
* thanks
  - utter_thanks

## goodbye
* goodbye
  - utter_goodbye
