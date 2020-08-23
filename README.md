# ticketing

Microservices-learning project

## Client

**React frontend** build with NextJs

## Services

**auth**: authentication service

**expiration**: checks time range

**payments**: uses Stripe API for payments

**tickets**: tickets service

**orders**: orders service

## Messaging

**Nats Streaming Server**

## Shared Code

**common**: shared code amongst microservices for events, errors, middlewares and validators

## Deployment

**Kubernetes cluster**

## Run the project

Clone the project and change to the project directory. Install skaffold tool and run
`skaffold dev`
Navigate with a browser to:

`https://ticketing.dev/orders`
