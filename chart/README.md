# Helm 

## What is Helm?
Helm is a Kubernetes deployment tool for automating creation, packaging, configuration, and deployment of applications and services to Kubernetes clusters. 

Kubernetes uses dedicated YAML manifest files, and Helm helps to better manage those files.


Imagine if K8s were an operating system, then Helm would be the package manager. Just like for macOS we use `brew install` to install applications on our computer. Helm acts in a similar way to K8s. 

With helm you can install, upgrade, fetch dependencies, and configure deployments on Kubernetes.



## Why do we need Helm? 
Helm is very helpful in that it automates the maintance of YAML manifests for k8s objects by packaging declaritive code into charts. Helm keeps track of version history of every chart installed and modified. Rolling back a deployment to a previous version or upgrading a cluster can be done using some common helm commands. 


