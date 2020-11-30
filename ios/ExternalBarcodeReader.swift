//
//  ExternalBarcodeReader.swift
//  scanSolution
//
//  Created by Bhenav on 3/1/19.
//  Copyright © 2019 haydigo. All rights reserved.
//

import Foundation

@objc(ExternalBarcodeReaderManager)
class ExternalBarcodeReaderManager: RCTViewManager {
  override func view() -> UIView! {
    return EBRTextField()
  }

  // this is required since RN 0.49+
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

