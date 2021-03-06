const API_URL = 'https://6037a0735435040017722e35.mockapi.io/api';

export const callApi = (uri, method, data) => {
  return axios({
    url: `${API_URL}/${uri}`,
    method,
    data,
  });
};
