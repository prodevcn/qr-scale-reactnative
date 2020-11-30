package com.scansolution;

import com.facebook.react.ReactActivity;
import android.view.KeyEvent; // <--- import
import com.github.kevinejohn.keyevent.KeyEventModule; // <--- import

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "scanSolution";
  }
  @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);
        super.onKeyDown(keyCode, event);
        return true;
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        KeyEventModule.getInstance().onKeyUpEvent(keyCode, event);
        super.onKeyUp(keyCode, event);
        return true;
    }

    @Override
    public boolean onKeyMultiple(int keyCode, int repeatCount, KeyEvent event) {
        KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event);
        return super.onKeyMultiple(keyCode, repeatCount, event);
    }
}
