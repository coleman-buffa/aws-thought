# Deep Thoughts

C'mon in and post your (G Rated) deep thoughts and post a picture alongside. This web application allows you to make a post with a picture and view posts made by others. Powered by React, AWS Dynamo DB and S3, and hosted on AWS EC2.

![Walkthrough](./deep-thoughts.gif)

## Table of Contents

| |||
|:-:|:-:|:-:|
| [Project Introduction](#deep-thoughts) | [Table of Contents](#table-of-contents) | [Goals and Methods](#goals-and-methods) 
| [Deployed Link](#deployed-link) | [Technologies](#technologies) | [Lessons Learned](#lessons-learned)
| [Author](#author) | [Acknowledgments](#acknowledgments) | [License](#license) |
---

## Goals and Methods

The overall goal of this project was to continue practicing building front ends using React as well as get into some of the offerings from Amazon Web Services (AWS). AWS offers a year of free services on many of their platforms which is a great opportunity for experimentation and exploration. 


Project highlights include setting up DyanamoDB to store the basics of a thought, storing images associated with a thought in a S3 bucket, and deploying the project to an instance of EC2. These services are attractive because:

* DynamoDB is a noSQL database that is offered for free along with your 1 year trial of AWS. At this free level of service we are provisioned 25GB of storage and up to 200,000 requests per month. In addition DynamoDB was made with high performance under extreme load conditions in mind.
* The Simple Storage Service (S3) is an object storage service that is scalable, secure, performs well, and is durable. S3 has a long list of purposes but I used it store and retrieve images.
* Elastic Compute Cloud (EC2) provides scalable computing capacity. AWS will assign you a segmented piece of hardware to run your code. At its free tier an instance of EC2 is a single CPU thread running at ~2.4 GHz and 1 GB of RAM. You are able to use this free service for 750 hours a month which allows you to  operate a single instance 24/7 for a month without going over the limit.

AWS offers cloud computing and storage that is easily scalable, and has put significant effort into making its offerings secure. To that end this project focused on learning and making use of AWS Identity and Access Management (IAM) to ensure application security. The steps taken to improve application security and prevent my new AWS account from racking up a huge bill where:
* Create an IAM user that only has administrative privileges and no access to billing information. This user can define IAM roles, which control how access to AWS resources are allowed, and can be removed in the event that the account is compromised.
* Define a IAM role that will allow an EC2 instance to make use of S3 and DynamoDB. This role was assigned to a newly created EC2 instance and ensures that the only AWS resources that can be used are the ones specified above. Silo-ing off resources in this manner prevents unauthorized or unintended account use.

### Back End
The back end of this project was primarily built using Node.js and Express.js. The purpose of this project was focused on implementing AWS and other technologies. The creation of the back end is standard and bears no discussion beyond its interaction with AWS. The first stage beyond preparing a boilerplate express server and get routes was to define the DynamoDB schema, create the S3 bucket, and configure the AWS CLI:

* Establish the schema and metadata of the table in DynamoDB as shown in the following snippet:
```javascript
    TableName : "Thoughts",
    KeySchema: [       
        { AttributeName: "username", KeyType: "HASH"},  //Partition key
        { AttributeName: "createdAt", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "username", AttributeType: "S" },
        { AttributeName: "createdAt", AttributeType: "N" }
```
Note that the using the "createdAt" entry as the range will automatically sort entries chronologically.

* Create the S3 bucket as shown in the following:
```javascript
let bucketParams = {
  Bucket : "user-images-" + uuidv4()
};

s3.createBucket(bucketParams, (err, data) => ...
```
Note that using unique universal ID allows us to create a unique name for bucket. S3 is designed to hold unstructured data and thus require no schema setup.

* The last setup step to get AWS hooked into the project was to teach the AWS-CLI our IAM user account keys. This information is used to connect to AWS and proves you are allowed. These are stored secretly in the CLI and only need to be added once. This can be accomplished by installing the NPM package 'AWS-SDK' and invoking:
```shell
aws config
```
Follow the prompts to enter your IAM user key, secret key, region of AWS service, and the data format you want to use (JSON most likely). Note that the secret key must be captured when you create you IAM user name. It cannot be regenerated after the user creation process. Protect the secret key like you would your credit card information. AWS recommends storing your secret key in the AWS-SDK instead of other methods.

Once the DynamoDB and S3 services were created and linked into the React front end it came time to deploy to an EC2 instance.

### Deployment
As described above when making IAM usernames I also defined a role and policy that would allow an EC2 instance to make use of DynamoDB and S3. This role can be generated both before and after the creation of the EC2 instance, but it is important to remember to assign the role to the EC2 instance. Steps taken to setup the EC2 were:

* Assign the appropriate IAM role.
* Select a preconfigured Linux 20.04 LTS Server instance.
* Configure a security group which controls the traffic on you EC2 instance. Since this will be a public facing instance configure access ports so that any IP address has access through ports 80, 22, and 443. These ports are for both HTTP (80) and HTTPS (443) requests to access the Site, and connecting to the instance via SSH (22).
* Name and collect the access key. This will be saved in a .pem file that should be stored in a secure place (such as a .ssh folder). This key is required to SSH into the instance for further configuration.

At this point the instance is provisioned and needs additional work. This comes in the form of installing and configuring many packages. The following packages were installed:
 * Node.js. This application runs on Node and Express.
 * AWS-CLI. As described above we need to teach the AWS-SDK about the access keys so the application has access to DynamoDB and the S3 bucket. 
 * Git was used to clone the application code from the GitHub repository to the EC2 instance. 
 * NginX acting as the web server. This required setting the configuration file to look in the client/build folder for the compiled React front end, and setting the access port for api routes.
 * PM2 was used to keep the react front end and express server running after logging out of the EC2 instance.

Nearly there! At this point we need build the react app, and navigate to the IP address of the EC2 instance to see the functioning application.


## Deployed Link

[Deployed to EC2]()

## Technologies 

| ||||
|:-:|:-:|:-:|:-:|
| JavaScript | Node.js | Express.js | React.js |
| AWS DynamoDB | AWS S3 | AWS EC2 | Multer | 
| AWS SDK | UUID | PM2 | NginX |

## Lessons Learned

The intention of this section is documenting some of the 'Aha's and Gotchas for posterity:
* Apache2 web server was loaded by default and occupied ports 80 and 443 before PM2 could start. Stopping all apache2 processes was required to free up the ports
* Various logging tools we used to determine the cause of issues. These include:

   * PM2 log running while testing the application in the browser
   * netstat -tunlp to examine the network state

## Author

Coleman Buffa

* [Git Hub](https://github.com/coleman-buffa/aws-thought)
* [My Portfolio](https://www.colemanbuffa.com/)
* [LinkedIn](https://www.linkedin.com/in/coleman-buffa/)

## Acknowledgments

My thanks to the many mentors and friends who are a constant source of project ideas, learning topics, and guidance.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### [Back to Table of Contents](#table-of-contents)
