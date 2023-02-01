# GraphQL Server API

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Clone the repository](#clone-the-repository)
4. [Install dependencies](#install-dependencies)
5. [Configure environment variables](#configure-environment-variables)
6. [Install MongoDB](#install-mongodb)
7. [Start the server](#start-the-server)
8. [Uploading Images](#uploading-images)
9. [Linking Products and Categories](#linking-products-and-categories)
10. [Conclusion](#conclusion)

## Introduction

This is the documentation for the GraphQL server that provides an API for managing products, categories, and images. The data is stored in MongoDB and the server is built using GraphQL.

## Getting Started

In order to run the server, you will need to have Node.js and MongoDB installed.

## Clone the repository

Clone the repository using the following command:

```bash
git clone git@github.com:martinholecekmax/graphql-server-api.git
```

## Install dependencies

Navigate to the project directory and run the following command:

```bash
npm install
```

**Note:** Nodemon is used for development. If you don't have it installed globally, you can install it with following command:

```bash
npm install -g nodemon
```

## Configure environment variables

Either create a `.env` file or rename `.env.example` to `.env` and fill in the values.

## Install MongoDB

You can either install MongoDB locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

After installing MongoDB, create a user with read and write permissions to the database

Following is an example of how to create a user in the MongoDB shell:

```bash
use test
db.createUser({"user" : "test","pwd": "password","roles" : [{"role" : "read","db" : "test"},{"role" : "readWrite","db" : "test"}],"mechanisms" : ["SCRAM-SHA-1","SCRAM-SHA-256"]})
```

**Note:** Use the same database name, username, and password in the `.env` file. Also, make sure to use strong passwords in production.

## Start the server

To start the server, run the following command:

```bash
npm start
```

Server will start on port 4000 by default (can be changed in `.env` file) and the GraphQL playground will be available at `http://localhost:4000/graphql`

## Uploading Images

The server allows images to be uploaded and stored in a AWS S3 bucket. The following environment variables need to be set in order to upload images:

```bash
AWS_BUCKET_NAME=''
AWS_BUCKET_REGION='eu-west-1'
AWS_ACCESS_KEY=''
AWS_SECRET_ACCESS=''
AWS_BUCKET_PUBLIC_URL=''
AWS_ROOT_DIRECTORY=''
```

**Note:** The `AWS_BUCKET_PUBLIC_URL` is the URL of the bucket. The `AWS_ROOT_DIRECTORY` is the directory where the images will be stored.

The URL of the image file is stored in the mongoDB database.

## Linking Products and Categories

Each product can be associated with a category. Products and categories can be linked by using the `products` field in the `Category` type. This field is an array of `Product` types. This allows products to be grouped and filtered by category.

## Conclusion

This GraphQL server provides a flexible API for managing products, categories, and images. The data is stored in MongoDB and the server supports a range of queries and mutations for accessing and updating the data.
