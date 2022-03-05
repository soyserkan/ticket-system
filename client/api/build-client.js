import axios from "axios"

export default function ({ req }) {
    if (typeof window === "undefined") {
        return axios.create({
            // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local', //
            baseURL: 'http://www.ticketsystem-serkan.xyz/',
            headers: req.headers
        });
    } else {
        return axios.create({ baseURL: '/' });
    }
};