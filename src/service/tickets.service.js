import axios from "axios";

const API_URL = 'https://6659437ade346625136bc267.mockapi.io/api/sekawanmedia/tickets/';


class TicketsService {
    getAll(params) {
        return axios.get(API_URL, {params});
      }
      
    get(id) {
        return axios.get(API_URL + id);
    }

    create(data) {
        return axios.post(API_URL, data);
    }

    update(id, data) {
        return axios.put(API_URL + id, data);
    }

    delete(id) {
        return axios.delete(API_URL + id)
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new TicketsService();