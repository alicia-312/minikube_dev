<!-- GETTING STARTED -->
## Getting Started

This a repository for local development on macOS Monterey 12.4. I have built a local minikube cluster and will be walking through step-by-step on how to set up a local environment for a Kubernetes Cluster. 


### Prerequisites

Required: 
```sh
brew install docker
brew install minikube
brew install helm
brew install --cask virtualbox

```
Nice to Have:
```sh
brew install zsh
brew install vscode
brew install k9s
```

### Installation

How to get started setting up a k8s cluster with minikube.

1. Type the following in  your terminal to start up the k8s cluster and have access to the k8s dashbaord UI for insights into the cluster health. You'll want to keep the `dashboard` up and running, so work from another iterm window or tab.  

```sh
minikube start
```

<img width="833" alt="Screen Shot 2022-07-23 at 09 27 34" src="https://user-images.githubusercontent.com/107967467/180611628-00ae29e7-ad3d-4111-afc7-d69388611b46.png">


```sh
minikube dashboard
```
<img width="839" alt="Screen Shot 2022-07-23 at 09 28 01" src="https://user-images.githubusercontent.com/107967467/180611639-7509fa20-dddf-4441-b089-2a8f5e968eff.png">

If you follow the link in the output from the above command you will be shown the kubernetes Dashboard, which is an interactive UI that allows you to 

<img width="1680" alt="Screen Shot 2022-07-23 at 09 39 15" src="https://user-images.githubusercontent.com/107967467/180612133-09ed22fa-5a07-4426-ac4d-fa7e6405b657.png">

This with start a basic K8s cluster, but this only contains the most basic storage (read/write from local directories), host level networking, and is a single node running all services. Which is not realistic in most environments like development, staging and production. More realistic defaults are preinstalled on your K8s cluster from your piublic cloud provider.

2. Create an Ingress Controller.
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
