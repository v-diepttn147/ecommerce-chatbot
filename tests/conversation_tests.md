#### This file contains tests to evaluate that your bot behaves as expected.
#### If you want to learn more, please see the docs: https://rasa.com/docs/rasa/user-guide/testing-your-assistant/

## sad sad 1
* get_balance_with_userAddress: Địa chỉ của tôi là [HF91JFNC45](userAddress), tôi muốn xem số dư
  - utter_confirm
  - action_get_balance

## sad sad 2
* get_balance: kiểm tra tài khoản
  - utter_get_balance
* give_userAddress: [HF84HFJD87](userAddress)
  - utter_confirm
  - action_get_balance

## sad sad 3
* get_balance_with_userAddress: Bạn ơi kiểm tra tài khoản [8URH1KDI89](userAddress) giúp mình với
  - utter_confirm
  - action_get_balance