# Path Hiking App Backend
![Path Architecture](https://github.com/Konfistador/HikingAppBackend/blob/main/docIMG/IntegrDiagram.jpg?raw=true)
> Path overall architecture


## Introduction
Path is an innovative exploring application, designed to reveal hidden and meaningful locations to explorers.It not only maps out these special spots for you, but also enriches the user's exploration through Storylines. These Storylines are not just a collection of locations, as they are thoughtfully curated to connect several places through a common historical event or other unique element they share. As an example, you can get a custom collection of places, where a given revolution took place or you can simply walk in the shoes of an ordinary roman pleb.
After visiting a location, the user scans a unique visit-qr image, which will result in a small reward. Completing an entire Storyline will grant you a shiny trophy and bonus points, which will inevitably boost your place up on the weekly leaderboard.

### The story of this Application
This Backend module is part of a Cloud-hosted iOS application called "Path". Path is a product of a team effort on a project, which was part of my bachelor studies at Fontys University of Applied Sciences. The frontend module of this project is excluded, as this part of the project was out of my scope of work. With this being said, the main purpose of this repository is to document some of the achievements and soultions I was able to build, while working on it.

### Why you can't find PATH on the Appstore
I personally came up with the concept for this application, as I was motivated to build and commercialy develop an app for my homecountry of Bulgaria, which guides you into visiting interesting places, earning points for your visits and exhanging those points for dining at a local restaurant / buying a souvenir with a certain discount.
I saw potential in my idea, as it would attract people to visit places and actively contribute to the local economy, thus boosting local markets. Due to this potential I was motivated to puruse financing for my idea and was keen to initialize an analysis into the market. 
However, the "BIG PROBLEM" of this concept came not very late after that - How to initialy attract users to download an unpopular app and use it? 

Another argument is that the current Mobile App market, in my own opinion, looks like one big monopoly - we have several big players in the global market(Instagram, Facebook, TikTok, X) and although I was feeling and acting very confident (and a bit cocky at times), I was not able to find the reason that our small Sardine will win the battle for user attention vs the Great White Shark(s).

Would love to create an entirely new refactored front end and try to launch as a hobby app in the future, so there is a high chance of this repository growing in the future :)

### My personal challenge
When I started working on this project, I was feeling very comfortable in the Object Oriented World of Java. It felt so strange at first to work with Typescript, with the absence of an empirical type system and an emphasis on funcitonal programming paradigms. As an engineer, it was interesting to see that software that fulfill certain requirements can be succesfuly built, using different technologies. In addition to this, it was interesting to implement Programming concepts into different languages and exprience the similiarity between technologies.
> This created the idea of Programming Languages, simply being the bricks and tools for building. Logically contionued, we can imagine that our choice of materials and tools will depend on the favorable end result.

### Awards and Recognition
Path was awarded third place in the annual competition between PRJ4 Groups at Fontys Venlo.

## Under the Hood 

### Database Schema
![Database Schema](https://github.com/Konfistador/HikingAppBackend/blob/main/docIMG/dbSchemaExp.png?raw=true)

### Features
- **Exploration of Hidden Locations**: Users can discover lesser-known places, resulting in a small reward.
- **Points System**: Our main strategy of keeping the user engaged is giving them regular small rewards. The conceptual idea behind it is that those points can be used for commercial exchange in the future e.g.(Discount codes, Vouchers).The system keeps track of the scoreboard for each user. 
- **Trophies**: Storylines provide interesting collections of places. Some of those collections are related to a given historical event / period / figure. When the explorer visits all locations from a given storyline, they are being awarded with a special trophy for the completed storyline. For example, completing the Storyline, tha focuses on the Roman Empire will give you "Roman Trophy"
- **Notiffications** : The system will send alerts, when new locations or storyline are being added.
- **Leaderboard**: All explorers compete in a shared leaderboard, where the person with most points for the month gets a special trophy :)
- **Location Services**: We are actively tracking the location of the explorer, in order to provide them with nearby locations and special nottificaitons.
- **User Account Management System**: Every explorer has an account and we keep track of the devices they use to authenticate, as well as their activity.


### Technology Stack
  1. **Loopback4** : This is the main framework used for the backend.
  2. **Node.js**: Runtime enviornment for executing the backend code
  3. **PostgresSQL**: Database Management System for, allowing us to store and manipulate our data.
  4. **PostGIS**: PostgreSQL extention for working with spacial data. This extention allows us to automatically calculate the distance between different locations.
  5. **Apple Push Notification service (APN)**: Service that allow us to send notifications.
  6. **NPM**: For managing libraries and dependencies, as well as very helpful for migrating our database.
  7. **Universal Modeling Language(UML)**: Used for communicating our ideas within the development team.
  8. **Docker**: was used to host the development enviornment(Postgres + node.js container)
  9. **JetBrains Webstorm**: was the IDE, used to write the code.

## Engineering achievements
In this sub-section, I would like to highlight interesting solutions, that I have implemented as part of this project.

 ### Proximity-Based Location Loading
 One of the key technical achievements in this backend system is the implementation of a proximity-based location loading system. The motivation behind this solution is a technical design that enchanses user experience and performance. When the frontend module requests location data, our backend is capable of dynamicaly calculating and delivering only those locations that are in close proximity to the user. This saves the backend from the need of sending a lot of redundant data, which also makes the work of the frontend easier and faster. This approach significantly reduces load times and improves app responsiveness, making the explorer's experience seamless and efficient. 

 ### Notification Scheduling Service, utilizing the APN
 Implementing a custom scheduling service, represents another technical milestone. This custom-made service is designed for scheduing and sending notifications to users. The implementation of the service allows for better user engagement, by delivering timely updates and alerts. The Apple Push Notification is lacking support for notification scheduling and this service can be seen as an extention.

 ### Automated Database Migration with Loopback4
  This backend leverages some of the advanced features for database management, that come with Loopback4. A significant achievement is the automatic migration of our database schema, which happens through the usage of NPM(migrate + other scripts). By writing aditional code in our Loopback4 models, we ensured that changes in the model definitions are automatically reflected in the database. Our approach gently simplified the dealing with database management, while ensured consistency between our application logic and the underlying data structures.

### Github Workflow for Automated Testing
One crucial component of the development process is the Github Workflow I created, which automatically tests every commit to the main branch and does not allow code that creshes or has failed tests to be merged into the main branch.

### Sophisticated Model Relationships
In the backend architecture, we implemented some complex and efficent realtionships between various data models, which is a cornerstone of our system's functionality. For instance,
- **Location** and **LocationImages** Relationship: We established a 'hasMany' relationship from Location to LocationImages, enabling each location to be associated with multiple images.
- **Inverse Relationship for Data Integrity**: Conversely, LocationImage is set to 'belongsTo' Location. This inverse relationship ensures data integrity and simplifies data retrieval, establishing a robust and interconnected data model.

### Reusability Through Software Design Principles
A pivotal aspect of our backend development is the adherence to solid software design principles, which has enabled the creation of multiple reusable services. This approach ensures that our codebase is not only efficient but also highly modular. Services designed for specific functionalities, such as user authentication or location data processing, can be easily reused across different parts of the application. This design strategy significantly enhances the scalability and maintainability of our backend, demonstrating our commitment to robust and efficient software engineering practices.

## Special thanks to:
- Nikola Velikov @NikolaVelikov02 for developing the crucial Authentication mechanism and logic.
- Bozhidar Ivanov @BozhidarIvanov02 for helping me with the data models and the planning of our database.

 
 
