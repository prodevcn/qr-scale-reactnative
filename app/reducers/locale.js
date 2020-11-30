import {FETCH_LOCALE, CHANGE_LOCALE} from '../constants/actions';

export default function reducer(
  state = {
    data: null,
    strings: null,
    fetching: false,
    fetched: false,
    error: null,
    uiLocale: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_LOCALE.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case FETCH_LOCALE.FAILURE: {
      return {
        ...state,
        error: action.payload,
        fetching: false,
      };
    }
    case FETCH_LOCALE.SUCCESS: {
      var strings = action.payload.keys.find(
        (p) => p.localeId === action.payload.uiLocaleId,
      ).keys;
      var uiLocale = action.payload.uiLocaleList.find(
        (p) => p.id === action.payload.uiLocaleId,
      );
      var dataLocale = action.payload.dataLocaleList.find(
        (p) => p.id === action.payload.dataLocaleId,
      );
      // console.log('++++++++', strings);
      // console.log('--------', uiLocale);
      // console.log('********', dataLocale);
      return {
        ...state,
        data: action.payload,
        strings: strings,
        uiLocale: uiLocale,
        dataLocale: dataLocale,
        fetched: true,
        fetching: false,
      };
    }
    case CHANGE_LOCALE: {
      const newState = {...state};

      newState.strings = state.data.keys.find(
        (p) => p.localeId === action.payload,
      ).keys;
      newState.uiLocale = state.data.uiLocaleList.find(
        (p) => p.id === action.payload,
      );
      newState.data.uiLocaleId = action.payload;

      return newState;
    }
  }

  return state;
}
