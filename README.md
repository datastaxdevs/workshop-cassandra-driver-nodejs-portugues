# Cassandra Node.js drivers practice

Hello and welcome!
This is the companion repository for the "Cassandra Node.js drivers practice"
presentation.
In this repository you'll find all code snippets for you to get some practice
and follow along - plus instructions to repeat the practice on your own!

You will complete this practice with a good understanding of what you can do,
and how, with the Node.js drivers for Apache Cassandra™.

For the complete **driver documentation**, please go
[here](https://docs.datastax.com/en/developer/nodejs-driver/4.6/)
and start exploring.

To get the **presentation slide deck**, click
[here](presentation/cassandra-nodejs-drivers-presentation.pdf).

This practice will be done on your own computer: you will need

- a working internet connection
- `Node.js` v15+
- `npm` v 7+

**Note**: don't worry if you don't have an Apache Cassandra™ installation
handy! Indeed, you can create your very own **Astra DB** database in
the cloud FOR FREE, which is a Database-as-a-service built on Apache Cassandra™,
and is perfect for the exercises (and not only...).

We will guide you through creation and setup of your Astra DB instance
momentarily.

## 1. Set up your environment

This is a practice session: we will not provide a `package.json` file
nor a full-fledged running app. You will have to follow some instructions
to set up your environment from scratch.

First let's install some dependencies:

    npm install cassandra-driver@4.6.3
    npm install express@4.17.1

You now have the Cassandra drivers ready to use! (As for `express`, it
will be needed for one of the demos later).
You will run the following practice in this directory, in a Node REPL if you
prefer.

## 2. Create & connect your database

We will guide you through creation of your Astra DB instance, which will act
as a Cassandra database in the cloud, ready for our experiments. Of course,
everything you see here will run as well with a regular Cassandra database.

The following instructions are for Astra DB: to work with standard Cassandra,
please skip to subsection "2b. Connecting to a Cassandra DB".

### 2a. Creating and connecting to Astra DB

_**`ASTRA DB`** is the simplest way to run Cassandra with zero operations at all - just push the button and get your cluster. No credit card required, $25.00 USD credit every month, roughly 5M writes, 30M reads, 40GB storage monthly - sufficient to run small production workloads._

✅ Register (if needed) and Sign In to Astra DB [https://astra.datastax.com](https://astra.datastax.com/): You can use your `Github`, `Google` accounts or register with an `email`.

_Make sure to chose a password with minimum 8 characters, containing upper and lowercase letters, at least one number and special character_

✅ Choose "Start Free Now"

Choose the "Start Free Now" plan, then "Get Started" to work in the free tier.

You will have plenty of free initial credit (renewed each month!), roughly corresponding
to 40 GB of storage, 30M reads and 5M writes.

> If this is not enough for you, congratulations! You are most likely running a mid- to large-sized business! In that case you should switch to a paid plan.

(You can follow this [guide](https://docs.datastax.com/en/astra/docs/creating-your-astra-database.html) to set up your free-tier database with the $25 monthly credit.)

<details>
    <summary>Signup screenshot (click to expand)</summary>
    <img src="images/astra_signup.gif" />
</details>

To create the database:

- **For the database name** - `nodepractice`.

- **For the keyspace name** - `chemistry`. The code below assumes this keyspace name, so please try not to be creative this time

| Parameter | Value 
|---|---|
| Database name | nodepractice |
| Keyspace name | chemistry |

_You can technically use whatever you want and update the code to reflect the keyspace. This is really to get you on a happy path for the first run._

- **For provider and region**: Choose and provider (either GCP, AWS or Azure). Region is where your database will reside physically (choose one close to you or your users).

- **Create the database**. Review all the fields to make sure they are as shown, and click the `Create Database` button.

You will see your new database `pending` in the Dashboard.

<details>
    <summary>Database in "pending" state (click to expand)</summary>
    <img src="images/dashboard-pending-1000-update.png" />
</details>

The status will change to `Active` when the database is ready, this will only take 2-3 minutes. You will also receive an email when it is ready.

<details>
    <summary>DB creation walkthrough (click to expand)</summary>
    <img src="images/astra-create-db.gif" />
</details>

### 2b. Connecting to a Cassandra DB

## 3. Prepare your database

## 4. Now for the practice!

## 5. The End
