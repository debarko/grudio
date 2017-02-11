nodejs-mysql-boilerplate
========================

Very basic nodejs/express setup with mysql authentication.

I found mongodb based boilerplates but I needed something that would work with mysql. I quickly put this together and I'm just getting familiar with Node, so let me know if you have any tips or suggestions for improving this.  I hope you find this useful.

This example only does local authentication, not authorization, with Passport.js.  Nor does it have any front-end setup - I'll leave that up to you.  I choose Bookshelf.js ORM because it nicely extends backbone.js, which is what I am most familiar with.  Knex.js would also work just fine or even just plain mysql.

## Quick Start

  * Run 'create database grudio'
  * Run 'use grudio'
  * Run 'users.sql'
  * Adjust to your database settings in db.dev.conf.js
  * Go to http://yourdomain:8989 to create a user
  * Start building your app!
