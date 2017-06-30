import axios from 'axios';
import * as CONSTANTS from '../constants/constants';

export function fetchDocuments(offset = 0, limit = 9) {
  return (dispatch) => {
    return axios.get(`/api/documents?limit=${limit}&offset=${offset}`)
    .then((res) => {
      dispatch({
        type: CONSTANTS.DOCUMENT.GET_ALL_SUCCESS,
        documents: res.data.rows,
        metaData: res.data.metaData,
        offset,
        query: ''
      });
    },
  (err) => {
    dispatch({
      type: CONSTANTS.DOCUMENT.GET_ALL_FAILURE,
      error: { message: `Error: ${err}` }
    });
  });
  };
}

export function saveDocument(doc) {
  if (!doc.id) {
    return (dispatch) => {
      return axios.post('/api/documents', doc)
    .then((res) => {
      dispatch({
        type: CONSTANTS.DOCUMENT.CREATE_SUCCESS,
        document: res.data
      });
    },
  (err) => {
    dispatch({
      type: CONSTANTS.DOCUMENT.CREATE_FAILURE,
      error: { message: `Error: ${err}` }
    });
  });
    };
  }
  return (dispatch) => {
    return axios.put(`/api/documents/${doc.id}`, doc)
    .then((res) => {
      dispatch({
        type: CONSTANTS.DOCUMENT.UPDATE_SUCCESS,
        document: res.data
      });
    },
  (err) => {
    dispatch({
      type: CONSTANTS.DOCUMENT.UPDATE_FAILURE,
      error: { message: `Error: ${err}` }
    });
  });
  };
}

export function deleteDocument(id) {
  return (dispatch) => {
    return axios.delete(`/api/documents/${id}`)
    .then(() => {
      dispatch({
        type: CONSTANTS.DOCUMENT.DELETE_SUCCESS
      });
    },
  (err) => {
    dispatch({
      type: CONSTANTS.DOCUMENT.DELETE_FAILURE,
      error: { message: `Error: ${err}` }
    });
  });
  };
}

export function searchDocuments(query, offset = 0, limit = 9) {
  return (dispatch) => {
    return axios
      .get(`/api/search/documents?q=${query}&limit=${limit}&offset=${offset}`)
      .then((res) => {
        dispatch({
          type: CONSTANTS.DOCUMENT.SEARCH_SUCCESS,
          documents: res.data.rows,
          metaData: res.data.metaData,
          query,
          offset
        });
      },
    (err) => {
      dispatch({
        type: CONSTANTS.DOCUMENT.SEARCH_FAILURE,
        error: { message: `Error: ${err}` }
      });
    });
  };
}
export function fetchUserDocuments(id) {
  return (dispatch) => {
    return axios.get(`/api/users/${id}/documents`)
      .then((res) => {
        dispatch({
          type: CONSTANTS.USER.GET_DOCS_SUCCESS,
          documents: res.data
        });
      }, (err) => {
        dispatch({
          type: CONSTANTS.USER.GET_DOCS_FAILURE,
          error: { message: `Error: ${err}` }
        });
      });
  };
}
