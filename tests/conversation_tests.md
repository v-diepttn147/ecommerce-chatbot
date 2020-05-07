#### This file contains tests to evaluate that your bot behaves as expected.
#### If you want to learn more, please see the docs: https://rasa.com/docs/rasa/user-guide/testing-your-assistant/


## simple path
* greet: Xin chào!
  - utter_greet
* introduce: Bạn là ai?
  - utter_bot
  - utter_can_do
* thanks: Cảm ơn bạn nha
  - utter_thanks
* goodbye: pipi
  - utter_goodbye

## get balance 1
* get_balance_with_userAddress: Địa chỉ của tôi là [1DiHCyo597iDMpHFF9nP5W9HZufMTieXae](userAddress), tôi muốn xem số dư
  - utter_confirm
  - action_get_balance

## get balance 2
* get_balance: kiểm tra tài khoản
  - utter_get_balance
* give_userAddress: [1J4t9fHesDSVkTay2gFs1xxHiZJtxuu34Y](userAddress)
  - utter_confirm
  - action_get_balance

## get balance 3
* get_balance_with_userAddress: Bạn ơi kiểm tra tài khoản [3GS6nwSAhxZr9SEFr8VgBZ3Ly65V4NseAd](userAddress) giúp mình với
  - utter_confirm
  - action_get_balance

## get balance 4
* give_userAddress: địa chỉ [13e9p5RsTtiyYJAftJ2qwvzxg8gZBdNjXm](userAddress)
  - utter_is_get_balance
* user_confirm: đúng rồi
  - utter_confirm
  - action_get_balance

## get balance 5
* give_userAddress: tài khoản [3DHnrGkqFqfcmzeAD2pEe2XgT2gNASfZ5R](userAddress)
  - utter_is_get_balance
* user_deny: không phải
  - utter_fine

## get transaction info 1
* get_transaction_info: bạn ơi kiểm tra thông tin giao dịch giúp mình với
  - utter_get_transaction_info
* give_transaction_info: [ec5edb1351866663529df3ae56cbe64ab3fbf4100650144ecd91a17c4ca83768](transactionId)
  - utter_confirm
  - action_get_transaction_info

## get transaction info 2
* get_transaction_info_with_transactionId: [6bd89bf6a11bd2e61437e18ef92511a6c5cc080f15de28c5b4a8274e55325f95](transactionId), kiểm tra thông tin giao dịch giúp mình
  - utter_confirm
  - action_get_transaction_info

## get transaction info 3
* give_transaction_info: giao dịch [cc6397f31548fbf0437ea08003db6634c4884b795048a0120696981547f691de](transactionId)
  - utter_is_get_transaction_info
* user_confirm: uh
  - utter_confirm
  - action_get_transaction_info

## get transaction info 4
* give_transaction_info: transaction id này [cc6397f31548fbf0437ea08003db6634c4884b795048a0120696981547f691de](transactionId)
  - utter_is_get_transaction_info
* user_deny: không không
  - utter_fine

## generate address
* gen_address: tôi cần một địa chỉ mới
  - utter_confirm
  - action_gen_address

## search book 1
* book_search_name: cần tìm quyển [Nhà Giả Kim](book_name)
  - utter_confirm
  - action_book_search_name
