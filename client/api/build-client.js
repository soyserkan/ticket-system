import axios from "axios"

export default function ({ req }) {
    if (typeof window === "undefined") {
        return axios.create({
            //baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            baseURL: 'http://157.245.24.165/',
            headers: req.headers
        });
    } else {
        return axios.create({ baseURL: '/' });
    }
};