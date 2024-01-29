# Path Hiking App Backend
![Path Architecture](https://github.com/Konfistador/HikingAppBackend/blob/main/docIMG/IntegrDiagram.jpg?raw=true)
> Path overall architecture


## Introduction
Path is an exploration app, designed to reveal hidden and meaningful locations to explorers.It not only maps out these special spots for you, but also enriches the user's exploration through Storylines. These Storylines are not just a collection of locations, as they are thoughtfully curated to connect several places through a common historical event or other unique element they share. As an example, you can get a custom collection of places, where _something took place_.<br>
After visiting a location, the user scans a unique visit-qr image, which will result in a small reward. Completing an entire Storyline will grant you a shiny trophy and bonus points, which will inevitably boost your place up on the weekly leaderboard.


## Under the Hood 

### Database Schema
![Database Schema](https://github.com/Konfistador/HikingAppBackend/blob/main/docIMG/dbSchemaExp.png?raw=true)

### Features
- **Exploration of Hidden Locations**: Users can discover lesser-known places, resulting in a small reward. Locations in proximity of the user are shown on a map view.
- **Reward System**: Our main strategy of keeping the user engaged is giving them regular small rewards. The conceptual idea behind it is that those points can be used for commercial exchange in the future e.g.(Discount codes, Vouchers). Currently, you can only flex 💪🏻 on the leaderboard. The system keeps track of a scoreboard for each user. 
- **Trophies**: Storylines provide interesting collections of places. Some of those collections are related to a given historical event, period or a figure. When the explorer visits all locations from a given storyline, they are being awarded with a special trophy for the completed storyline. For example, completing the Storyline, tha focuses on the Roman Empire will give you the "Roman Trophy" and a virtual high five ;) 
- **Notiffications** : The system will send alerts, when a new location, trophy or storyline is added.
- **Leaderboard**: All explorers compete in a shared leaderboard, where the person with most points for the month gets a special trophy :)
- **User Account Management System**: Every explorer has an account and we keep track of the devices they use to authenticate, as well as their activity.


### Tech Stack
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
One of the key technical achievements in this backend system is the implementation of a proximity-based location loading system. The motivation behind this solution is a technical design that enchanses user experience and performance. When the frontend module requests location data, our backend is capable of dynamicaly calculating and delivering only those locations that are in close proximity to the user.
<br>This saves the backend from the need of sending a lot of redundant data, which also makes the work of the frontend easier and faster. This approach significantly reduces load times and improves app responsiveness, making the explorer's experience seamless and efficient. <br> 
This was an interesting stage, as it involved choosing between creating a dependency to an external service for calculating spacial data or extending the functionality of some of the existing modules. The decision was to extend the PostgreSQL Database by adding the PostGIS extention. After reading extensive documentation, it came quite clear that PostGIS is reliable enough. This saved us from potentialy having to spend money/per call to external API's calculating distances for us, based on the spacial data we store for each location. 

 ### Notification Scheduling Service, utilizing the APN
Implementing a custom scheduling service, represents another technical milestone. This custom-made service is designed for scheduing and sending notifications to users. The implementation of the service allows for better user engagement, by delivering timely updates and alerts. The Apple Push Notification is lacking support for notification scheduling and this service can be seen as an extention.

 ### Modular Architecture for Flexibility and Scalability
A significant engineering achievement of this project is the development of a modular architecture that distinctly separates the backend and frontend. This design choice allows for enhanced flexibility and scalability. The backend, structured as a series of microservices, can easily interface with multiple frontend applications. Each frontend, whether it's a web app, a mobile app, or any other client, can seamlessly access the backend's endpoints. This modular approach not only simplifies maintenance and updates but also paves the way for future expansions where different frontends can be developed and integrated without restructuring the core backend logic. 
<br> Simplified,this approach allows for one single backend to support multiple mobile/web frontend implementations, simultaneously.

 
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

### Efficient Image Storage Using 32-Bit Format
Another key aspect of our backend's engineering efficiency is the ability to store all images in a 32-bit format. This strategic choice significantly reduces the app's data footprint, making it more lightweight and requiring less storage space. This approach not only enhances the app's performance on user devices but also optimizes data transfer between the server and the clients. By storing images in this compact format, we have effectively streamlined the overall user experience while maintaining high-quality visual content.

<br>

## The story of this Application
This Backend module is part of a Cloud-hosted iOS application called "Path". Path is a product of a team effort on a project, which was part of my bachelor studies at Fontys University of Applied Sciences. The frontend module of this project is excluded, as this part of the project was out of my scope of work. Furthermore, the sole purpose of this repository is to document some of the achievements and soultions I was able to build, while working on it.

## Why you can't find PATH on the Appstore
I came up with the concept for this application, as I was motivated to build and commercialy develop an app for my homecountry of Bulgaria, which guides you into visiting interesting places, earning points for your visits and exhanging those points for dining at a local restaurants / buying a souvenir with a certain discount. 
I saw potential in my idea, as it would attract people to visit places and actively contribute to the local economy, thus boosting local markets in small villages. In addition to this, it provided grounds for a business model, suitable for passive monetization via taxing businesses for being visible to potential customers.
However, one of the main drawbacks of this model came quite quickly -** How to initialy attract users to download an unpopular app and engage into using it? **

> It's clear that pulling this off would hinge on either a hefty reward system or some top-notch marketing. 

Would love to create an entirely new refactored front end and try to launch as a hobby app in the future, so there is a high chance of this repository growing :)

## My personal challenge
When I began working on this project, I was feeling very comfortable in the Object Oriented World of Java. It felt very strange at first to work with Typescript, mainly due to the absence of a [nominal type system](https://en.wikipedia.org/wiki/Nominal_type_system) and strong emphasis on funcitonal programming paradigms. As an engineer, it was interesting to see that software that fulfill the same requirements can be succesfuly built, using different technologies. In addition to this, it was interesting to implement Programming concepts into different languages and exprience the similiarity between different programming technologies.
> This created the idea of Programming Languages, simply being the bricks and tools for building. Additionaly, we can imagine that our choice of materials and tools will depend on the most suitable option for the pre-defined requirements

## Awards and Recognition
Path was awarded third place in the annual competition between PRJ4 Groups at Fontys Venlo.


# Special thanks to:
- Nikola Velikov @NikolaVelikov02 for developing the crucial Authentication mechanism and logic.
- Bozhidar Ivanov @BozhidarIvanov02 for helping me with the data models and planning of our database.

 
 
