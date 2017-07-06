import { DOCUMENT, USER } from '../constants/Constants';
import initialState from '../utilities/initialState';

/**
 * Pagination Reducer
 * @param {object} [state=initialState.auth] [state object parameter]
 * @param {object} action    object parameter contains action type and payload
 * @returns {object}  returns a state object
 */
const PaginationReducer = (state = initialState.pagination, action) => {
  switch (action.type) {
  case DOCUMENT.GET_DOCS_SUCCESS:
  case USER.GET_ALL_SUCCESS:
  case USER.SEARCH_SUCCESS:
    return Object.assign(
      {}, action.metaData, { offset: action.offset, query: action.query }
    );

  default:
    return state;
  }
};


export default PaginationReducer;
