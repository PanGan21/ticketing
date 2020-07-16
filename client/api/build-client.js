import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server
    // requests are made from inside kubernetes
    // the headers coming from the browser have the cookie and should be included in the request

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // we are on the browser
    // requests are made from the browser and the headers are included by default

    return axios.create({
      baseURL: "/",
    });
  }
};
