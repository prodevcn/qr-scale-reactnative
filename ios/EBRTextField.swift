//
//  EBRTextField.swift
//  scanSolution
//
//  Created by Bhenav on 3/1/19.
//  Copyright © 2019 haydigo. All rights reserved.
//

import UIKit

class EBRTextField: UITextField, UITextFieldDelegate {
  @objc var onReadBarcode: RCTDirectEventBlock?
 
  func textField(_ textField: UITextField,
                 shouldChangeCharactersIn range: NSRange,
                 replacementString string: String) -> Bool {
    let text = textField.text! + ""
    let obj:[String: Any] = ["text": text]
    let  char = string.cString(using: String.Encoding.utf8)!
    let isEnter = strcmp(char, "\\b")
    if(isEnter == -82){
      if onReadBarcode != nil {
        print("text onReadBarcode")
        textField.text = ""
        onReadBarcode!(obj)
      }
      textField.text = ""
      print("text \(text as Optional) string: \(string) isEnter: \(isEnter) char: \(char)")
    }
    return true
  }
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    text = ""
    textAlignment = .center
    becomeFirstResponder()
    returnKeyType = UIReturnKeyType.done
    autocapitalizationType = .none
    autocorrectionType = .no
    delegate = self
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
