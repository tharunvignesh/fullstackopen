import axios from "axios";
const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
    return axios.get(baseUrl).then(res => res.data);
}

const create = (payload) => {
    return axios.post(baseUrl, payload).then(res => res.data);
}

const update = (id, payload) => {
    return axios.put(`${baseUrl}/${id}`, payload).then(res => res.data);
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(res => res.data);
}

export default { getAll, create, update, remove };