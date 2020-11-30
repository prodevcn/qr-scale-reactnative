import {FETCH_HOME, UPDATE_HOME} from '../constants/actions';

export default function reducer(
  state = {
    home: {
      user: {},
    },
    dateTimeOptions: {
      timeZone: 0,
      dateTimeFormat: 'European',
    },
    numberOptions: {
      decimalSymbol: '.',
      digitGroupingSymbol: ',',
    },
    fetching: false,
    fetched: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_HOME.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case FETCH_HOME.FAILURE: {
      return {
        ...state,
        error: action.payload,
        fetching: false,
      };
    }
    case FETCH_HOME.SUCCESS: {
      const {
        timezone,
        dateTimeFormat,
        decimalSymbol,
        digitGroupingSymbol,
      } = action.payload.user;

      const timeZoneSplitted = timezone.BaseUtcOffset.split(':');
      const timeZoneStartsWidthPlus = timeZoneSplitted[0].startsWith('+');
      const timeZoneStartsWidthMinus = timeZoneSplitted[0].startsWith('-');

      const timeZoneFirstChar =
        !timeZoneStartsWidthPlus && timeZoneStartsWidthMinus
          ? ''
          : timeZoneStartsWidthPlus
          ? ''
          : '+';

      const timeZoneConverted =
        timeZoneFirstChar + timeZoneSplitted[0] + ':' + timeZoneSplitted[1];

      let dateTimeOptions = {timeZone: timeZoneConverted, dateTimeFormat};

      let numberOptions = {decimalSymbol, digitGroupingSymbol};
      // console.log('time00000', dateTimeOptions);
      // console.log('nujbmer--000-', numberOptions);
      return {
        ...state,
        home: action.payload,
        dateTimeOptions,
        numberOptions,
        fetched: true,
        fetching: false,
      };
    }
    case UPDATE_HOME: {
      const {
        timezone,
        dateTimeFormat,
        decimalSymbol,
        digitGroupingSymbol,
      } = action.payload.user;

      const timeZoneSplitted = timezone.BaseUtcOffset.split(':');
      const timeZoneStartsWidthPlus = timeZoneSplitted[0].startsWith('+');
      const timeZoneStartsWidthMinus = timeZoneSplitted[0].startsWith('-');

      const timeZoneFirstChar =
        !timeZoneStartsWidthPlus && timeZoneStartsWidthMinus
          ? ''
          : timeZoneStartsWidthPlus
          ? ''
          : '+';

      const timeZoneConverted =
        timeZoneFirstChar + timeZoneSplitted[0] + ':' + timeZoneSplitted[1];

      let dateTimeOptions = {timeZone: timeZoneConverted, dateTimeFormat};

      let numberOptions = {decimalSymbol, digitGroupingSymbol};

      return {
        ...state,
        home: action.payload,
        dateTimeOptions,
        numberOptions,
      };
    }
  }

  return state;
}
