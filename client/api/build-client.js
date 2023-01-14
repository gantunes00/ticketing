import axios from "axios";

export default ({ req }) => {
  if(typeof window === 'undefined') {
    // we are on the server
    // requests should be made to http://ingress...
    return axios.create({
      //baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      baseURL: 'http://www.ticketing-app-gantunes00.shop/',
      headers: req.headers
    });
  } else {
    // we are on the browser
    // base url ''
    return axios.create({
      baseURL: '/'
    });
  }
}