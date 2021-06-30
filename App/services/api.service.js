const BASE_SERVER_URL = 'https://chatapp-simple-server.herokuapp.com'
import axios from 'axios'

const createOrdUpdateAccount = (user) => {
    return axios.post(`${BASE_SERVER_URL}/user`, user, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const getUsers = () => {
    return axios.get(`${BASE_SERVER_URL}/user`)
}

const sendMessage = (tokenUserToSend, tokenUserAuthenticated, from, to, body, roomId, nameUserToSend) => {
    return axios.post(`${BASE_SERVER_URL}/notification`, { tokenUserToSend, tokenUserAuthenticated, from, to, body, roomId, nameUserToSend }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const getMessages = (from, to) => {
    return axios.post(`${BASE_SERVER_URL}/room`, { from, to }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export {
    createOrdUpdateAccount,
    getUsers,
    sendMessage,
    getMessages,
    BASE_SERVER_URL
}