//
//  ExternalBarcodeReaderBridge.m
//  scanSolution
//
//  Created by Bhenav on 2/28/19.
//  Copyright © 2019 haydigo. All rights reserved.
//

#import "React/RCTViewManager.h"
@interface RCT_EXTERN_MODULE(ExternalBarcodeReaderManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(onReadBarcode, RCTDirectEventBlock)

@end
