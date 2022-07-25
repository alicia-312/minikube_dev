<!-- GETTING STARTED -->
## Getting Started

This a repository for local development on macOS Monterey 12.4. I will walk you through how to build a local minikube cluster. How to set up helm to manage your applications and we can continue building from there! I wrote up some requirements below to follow. 

### What do we want to do? 

For this exercise we want to
- build a local k8s cluster
- deploy a node.js webapp
- create a docker image
- manage the webapp deployed via helm
- deploy an nginx ingress controller via helm
- have the webapp service ONLY be routable from outside the cluster on the URL `http://local.ecosia.org/tree`
- Endpoint for webapp service should ONLY accept GET requests from the path `http://local.ecosia.org/tree`

Bonus!
- set up a Chart.yaml to codify your configuration of helm
- be descriptive in the readme, this exercise should be easily followed and interpreted
- set up Github Actions to deploy changes made to the helm chart version

### Prerequisites

Required: 
```sh
brew install docker
brew install kubectl
brew install node
brew install minikube
brew install helm
brew install --cask virtualbox
brew install npm
```

Nice to Have:
- K9s is a wonderful tool that makes is super easy to navigate your kubernetes clusters and easily view all your manifest files
```sh
brew install k9s
```

### Build a local K8s cluster

How to get started setting up a k8s cluster with minikube.

1. Since you've installed the prerequisite by running `brew install minkube` and have virtual box installed as well. You can easily start your local Kubernetes cluster for development. Type the following in your terminal to start up the k8s cluster and have access to the k8s dashbaord UI for insights into the cluster health. You'll want to keep the `dashboard` up and running, so work from another iterm window or tab.  

```sh
minikube start
```

<img width="833" alt="Screen Shot 2022-07-23 at 09 27 34" src="https://user-images.githubusercontent.com/107967467/180611628-00ae29e7-ad3d-4111-afc7-d69388611b46.png">


```sh
minikube dashboard
```

<img width="839" alt="Screen Shot 2022-07-23 at 09 28 01" src="https://user-images.githubusercontent.com/107967467/180611639-7509fa20-dddf-4441-b089-2a8f5e968eff.png">


You now have a basic K8s cluster, but this only contains the most basic storage (read/write from local directories), host level networking, and is a single node running all services. Which is not realistic in most environments like development, staging and production. More realistic defaults are preinstalled on your K8s cluster from your piublic cloud provider.

### Deploy a node.js web app

Create `package.json` that will outline dependencies for your project.

```sh
{
  "name": "node-js-sample",
  "version": "1.0.0",
  "description": "A sample Node.js app",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.13.3"
  },
  "engines": {
    "node": "v18.6.0"
  },
  "author": "Pankaj Sharma",
  "license": "MIT"
}
```

Create `server.js` file that uses express js to create a simple web server listening on port 8080
 
```sh
'use strict';
const express = require('express');
// Constants
const PORT = 8080;
const HOST = 'localhost';
// App
const app = express();
app.get('/', (req, res) => {
res.send('Hello world\n');
});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
```

To test this
- run `npm install` to install all the dependencies

<img width="826" alt="Screen Shot 2022-07-24 at 19 16 43" src="https://user-images.githubusercontent.com/107967467/180843547-375cf066-de85-47ba-8f34-8144a547579c.png">

- then run `npm start` 

<img width="824" alt="Screen Shot 2022-07-24 at 19 16 51" src="https://user-images.githubusercontent.com/107967467/180843588-84317328-9104-4fbc-a51d-4382f1f59525.png">


### Create a docker image

By creating our own docker image we host it on DockerHub, and pull the image onto our machine.

Create `Dockerfile` to keep the commands needed to assemble our docker image.

```sh
from node:8

# Create app directory
WORKDIR /usr/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
```

Run the following command: `docker build .`


<img width="825" alt="Screen Shot 2022-07-24 at 19 19 06" src="https://user-images.githubusercontent.com/107967467/180847696-045dee95-339f-45d8-ae42-c7026000a5c6.png">


Name your docker image 

```sh
docker tag <IMAGE ID> <USERNAME>/<APPNAME>
```

To list your newly created image: 

```sh
docker images
```

<img width="828" alt="Screen Shot 2022-07-24 at 19 32 41" src="https://user-images.githubusercontent.com/107967467/180847730-4fa73114-d49e-4f2e-853d-576275eea1ec.png">


I use docker hub repo to push my images. We will create this as a public image

Run the following commands:

```sh
docker login 
docker push <USERNAME>/<APPNAME>
```

### Helm Chart
Now that we have a node app, and a public docker image to run our application. Lets create a helm chart to help us manage our kubernetes cluster. Helm charts provide us with a better way to manage all of our Kubernetes YAML files for our projects. We can deploy versions of our helm chart onto our k8s cluster and can easily see a `diff` to understand the differnces and updates that may occur in a new version of our application. 

Create helm chart: 

```sh
helm create helm-chart
```

This will create a template strucutre for helm. We will need to make some modifications to this in order to get our application running. 

Make the following changes to the values.yaml file

Update the image to use your custom Docker image we created earlier.

```sh
image:
  repository: aliciaco/helloworld
  tag: latest
  pullPolicy: IfNotPresent

nameOverride: ""
fullnameOverride: ""
```

Update the service port configuration

```sh
service:
  type: NodePort
  exposePort: 30000
  targetPort: 8080
  internalPort: 3000
```

Navigate to your `service.yaml` configuration file

```sh
spec:
  type: {{ .Values.service.type }}
  ports:
    - nodePort: {{ .Values.service.exposePort }}
      port: {{ .Values.service.internalPort }}
      targetPort: {{ .Values.service.targetPort }}
      protocol: TCP
      name: http
```

### Deploy Helm Chart and Validate Application Running

Run the following command to deploy the helm chart to your cluster

```sh
helm install <APPNAME> helm-chart/
```

Now that the helm chart is deployed! We want to test this against our browser

```sh
minikube service list 
```


insert image here


```sh
minikube service <SERVICE-NAME> --url
```

Congrats! you can access your app now and you have deployed your application with the help of helm charts to better manage your YAML configuration files needed for Kubernetes and allow for easier versioning and auditing of your applications configuration. 







































An ingress controller is a specialized load balancer for K8s. An ingress controller abstracts away the complexity of k8s application traffic routing and provides a bridge between K8s services and external services. 

Kubernetes Ingress Contollers: 
	- Accept traffic from outside k8s, and load balance the traffic to pods running inside the platform.
	- Manages egress traffic inside  a cluster for services which need to communicate outside the cluster
	- Monitor the pods running in K8s and auto-update the load-balancing rules when pods are added or removed from a service. 

```sh

minikube addons enable ingress
```
<img width="833" alt="Screen Shot 2022-07-23 at 09 27 14" src="https://user-images.githubusercontent.com/107967467/180611614-5917d887-4603-47fd-95b9-f2c7dd6211c4.png">

2. Create a deployment.
A k8s pod is a group of one or several containers tied together for administration and networking. A k8s deployment checks on the health of your pod and restarts the pods container if it terminates. Deployments are the recommended way to manage the creation and scaling of pods in your k8s cluster.

a. You will use the `create` command to build the deployment that will manage the Pod. This pod will be running the `echoserver` image. Echo server is an application that allows a client and a server to connect so a client can send a message to the server, and the server can receive the message and send, or echo, it back to the client. Echo server is written in Java.

```sh
kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.10
```

3. Now we need to expose the port for the hello-node deployment so services deployed using the ingress controller can be accessed

```sh
kubectl expose deployment hello-node --type=NodePort --port=8080
```

4. Validate that we have a service running 
```sh
kubectl get services -A
```
<img width="1015" alt="Screen Shot 2022-07-23 at 09 09 27" src="https://user-images.githubusercontent.com/107967467/180611563-e1cde6a3-cb47-45df-837a-7df3707b8048.png">


You can even print out the URL for the serivce and go to the site in your browser. 

```sh
minikube service hello-node  --url
```
<img width="831" alt="Screen Shot 2022-07-23 at 09 28 59" src="https://user-images.githubusercontent.com/107967467/180611706-ca6abd4a-9aba-4b05-b9b8-a2578698ddab.png">

When you go to the URL you will see soemthing like this:

<img width="828" alt="Screen Shot 2022-07-23 at 10 05 39" src="https://user-images.githubusercontent.com/107967467/180613145-1f97e7d5-0865-4c10-ae76-faca13976dcd.png">


5. Deploy an Ingress Object.
Create an ingress object by running the following command: 

```sh
kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
```
<img width="822" alt="Screen Shot 2022-07-23 at 10 44 28" src="https://user-images.githubusercontent.com/107967467/180614957-0d2dfa59-a4b3-433f-8c9b-1b3f85456df3.png">


You can validate this easily be taking a look in k9s like so.

<img width="823" alt="Screen Shot 2022-07-23 at 10 37 01" src="https://user-images.githubusercontent.com/107967467/180614945-048a285d-dffb-4817-b91e-df5ce269af35.png">

You can view the yaml for the ingress object

<img width="816" alt="Screen Shot 2022-07-23 at 10 37 12" src="https://user-images.githubusercontent.com/107967467/180614953-bd167396-c29e-45f1-a545-b9ae3e0ce710.png">

You can describe the ingress object in K9s and see the events as well as the path and more: 

<img width="824" alt="Screen Shot 2022-07-23 at 10 56 38" src="https://user-images.githubusercontent.com/107967467/180615069-11f19f58-2bca-454a-a08c-0f0ab4bfbe0c.png">

