##Thunderdome 2.0##
Final WDI immersive project.

The Thunderdome 2.0 is a chat app that allows users to sign in on facebook, go to the chat, they will see their friends in the room (or not) and themselves. The chat box starts at the bottom, so they get the latest messages. When users enter, other users will get an updated list of current users in the chatroom on the right. Furthermore, a message will display in the chatroom that notifies when a new user enters the Dome.

No need for users to upload photos, as the facebook login handles that for them. This chat app is incredibly "plug and play" and ready to use at any time.

#################
Technologies Used!

Front-End:
Angular JS
Express

Back-End:
Node JS
MongoDB/Mongoose

Other:
Socket.io

#################
Deployed at:
thethunderdome.herokuapp.com

#################
Major Hurdles:
Getting the current users in the chat to display was difficult. I had to identify the users by a unique socket id, append the unique socket id to an object that is stored server side, check if the user exists so that we don't push multiple users, send the server array to the clients, and then finally display the information.

Sessions was also difficult, as I went about it a round about way that would break in random ways. It's still a little buggy. But the cookies get set on the client and server, it's just that sometimes, it would display your name, welcoming you to the thunderdome.

Passport Authorization was rather difficult too. Passport is a great tool, but documentation is mediocre at best, arguably the worst aspect of some open source applications. I read through several tutorials and blog posts on the subject to get a grasp on what was happening, and how to begin implementing it.

Socket.io is another example of a technology with lackluster Docs. That being said, this was my second time using this technology and now feel comfortable using it in almost any setting whatsoever. I may have to look back and google foo a few times, but I have the basics down and would be willing to tackle bigger projects using this software. Towards the end, I realized Socket.io is not the ideal technology to use for chat apps, but it still has tons of uses.

#################
Future Additions Planned:
Animations are something I didn't have time to play around with too much, but in the future I'm going to implement some fade-ins and slide ins to make it more visually appealing.

Splash page needs to be more friendly, and I plan on brainstorming a simple way to make the UX more desireable.


#################
Contact me!
There are several ways to contact me, as listed below.

Facebook: Just search for Keaton Laney
Linkedin: Look for the Web Developer Keaton Laney
Email: Klaney@keaton.tech
Phone: Email me for my phone, I'm avoiding posting it here to avoid spam.

Thank you for your interest and use of my app!
