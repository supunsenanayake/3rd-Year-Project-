# SAHANA Disaster Management & Communication System - 3rd year Project

Web URL : http://ec2-18-221-166-17.us-east-2.compute.amazonaws.com

Our Vision : HELP EACH OTHER & BUILD SRI LANKA TOGETHER

Objective : In this website we are mainly focusing on gathering donations, sending donations to required places,Inform the details of the disaster
            Event to People & gather community to help people who affect by the disaster.

Our Project has two parts
    1). Website
    2). Communication System
1). Website

Website have Events.4 recent events display on the website.NEW status show the newly created event.
when a disaster happen, admin create that disaster event. When user click a event, Then user
can see every details relevant to that event, Not only that Every functions also working for that
user selected Event.
 Example : When user go to a event & select news, He/She only can see the news relevant to that event.

Donation divide in to three categories.
     1). Ordered Donations - When user login to system select the donations willing to give.
     Those donations are in this category.
     2). Stored Donations - When User hand over the donation to our Donations check points
     (Places where gather Donations).
     3). Distributed Donations - When We collect donations in our donations centers, then we send
     those collected donations to required places.

Handling Donations :
     In donation handling, every donation has a status.
     four status have.
     1). Pending - When user login to system select the donations willing to give.
                        Those donations have this status.
     2). Call Once - When Super Volunteer call for the donors contact number to contact
     him/ her to verify the donations which he/she select in website. But When call, donor not
     answer the call, those donations have this status.
     3). Call Twice - When call for second time, donor not
          answer the call, those donations have this status.
     4). Confirm - When donor answer the call & confirm the donor selected donations. those
     donations have this status.
     5). Success - When donors came to our donation centers & handover their donations.those
         donations have this status.
     6). Distributed - When donations distribute for the required places. Then These donations
         have this status.

Note :
   1). Super volunteer call only one time per round. if call not answer next
       second time call in next round on another day. until the second call status is call once.
   2). When donors call to our contact number, also can verify their selected donations.


   Modules - Admin , Super Volunteer, Volunteer, Donor

   Admin Functions -
       1). Create Disaster Event
       2). Edit / Delete Disaster Event
       3). Edit / Delete News
       4). Add System Users
       5). Change System User's Role (user system privileges)

   Admin and Super Volunteer common Functions -
       1). Chat Box
       2). Handling Donations

   Admin , Super Volunteer and Volunteer common Functions -
       1). Publish News
       2). Publish Videos

   Common Functions -
          1). Login / Register
          2). View Profile
          3). Update Profile
          4). Rest Password
          5). Add Donations
          6). View Events, News and Videos
          7). View the event / news publisher's details and the time news / event created
          8). View Him/her Ordered , Stored , Distributed Donations.

          Technologies Used -
              1). Full stack web development - Node.js with Express Application Generator
              2). Database - MongoDB
              3). Authentication - Passport.js
              4). Online Chat - Socket.io


 2). Communication System
