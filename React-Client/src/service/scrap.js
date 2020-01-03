import axios from 'axios';
import environment from '../global';
export const scrap = (url) => {
    return new Promise((resolve, reject) => {
        axios.post(environment.apiUrl + '/scrap', { url })
            .then(res => {
                console.log("service res:", res);
                if (res.data.status) {
                    console.log("service res.data:", res.data);
                }
                return resolve(res.data);
            }, (error) => {
                console.log("services error");
                console.log(error);
                return reject(error);
            })
    })
}