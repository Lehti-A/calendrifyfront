import axios from "axios";

export default {

    sendPostNewUserRequest(newUser) {
        console.log("olen siin")
        return axios.post('/register', newUser);
    }

}