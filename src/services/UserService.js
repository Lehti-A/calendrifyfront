import axios from "axios";

export default {

    sendPostNewUserRequest(newUser) {
        return axios.post('/register', newUser);
    }

}