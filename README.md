# Pet Scraper
The goal of this project is to create a centralized platform that aggregates animal data from multiple animal shelters' websites, facilitating the search for dogs and cats for potential local pet owners. The project aims to provide a user-friendly interface where users can easily find and adopt pets in their local area.

## Technologies Used
- **Back-End**
  - **Node.js:** A JavaScript runtime environment used for server-side development.
  - **Express JS:** A web application framework for handling HTTP requests and responses.
  - **Cheerio JS:** A library for extracting data from HTML and XML documents.
  - **MongoDB:** A NoSQL document-oriented database used for storing the scraped animal data.
  - **Mongoose:** An Object Data Modeling (ODM) library for MongoDB, providing schema-based data modeling.

- **Front-End**
  - **React:** A JavaScript library for building user interfaces.
  - **Next.js:** A powerful framework built on top of React, providing features like routing, image optimization, and server-side rendering (SSR) for improved SEO leverage.
  - **TypeScript:** A typed superset of JavaScript that brings static typing and compile-time checks to the development process. TypeScript enhances code quality, provides improved developer tooling, and reduces runtime errors.
  - **Axios:** A library used for making HTTP requests from the front-end to the back-end APIs.
  - **Bootstrap 5:** A widely-used CSS framework that provides pre-built components and a responsive grid system for easier and faster front-end development.
  - **PurgeCSS:** A tool utilized to remove unused CSS from the project, reducing the CSS build files' size and improving performance.

**Key Features:**
- **Scraping and Data Processing:** The back-end of the site is responsible for scraping animal data from various animal shelters' websites using Cheerio. It processes, filters, and organizes the data, ensuring it is ready for display on the front-end.
- **Centralized Database:** The scraped animal data is stored in a MongoDB database using Mongoose for efficient and schema-based data modeling.
- **User-Friendly Interface:** The front-end, built with React, Next.js, TypeScript, and Bootstrap 5, provides an intuitive user interface where potential pet owners can easily search for dogs and cats based on different criteria such as breed, age, and gender.
- **TypeScript**: The project incorporates TypeScript to enhance code reliability and maintainability. TypeScript provides type safety, allowing for easier debugging and reducing potential runtime errors.
- **Performance Optimization:** PurgeCSS is employed to remove unused CSS from the project, reducing the CSS build files' size and improving loading times.
- **API Endpoints:** The back-end server provides an API for data consumption. It exposes several endpoints that allow users to retrieve specific data and customize their search options. Detailed documentation regarding data fetching from these API endpoints can be found in the "API" section on the live site: https://petscraper-client.vercel.app/documentation.
- **CI/CD Strategy:** The project follows a continuous integration and continuous deployment (CI/CD) strategy, ensuring that changes are thoroughly tested and deployed efficiently. This is achieved via Vercel's hosting services.

By leveraging Node.js, Express, Cheerio, MongoDB, Mongoose, React, Next.js, TypeScript, Axios, Bootstrap 5, PurgeCSS, and a robust CI/CD strategy, this web project aims to streamline the pet adoption process by aggregating animal data from various shelters' websites, providing a centralized platform for potential local pet owners to find their ideal pets while benefiting from the advantages of TypeScript in terms of type safety, code quality, and developer productivity.

## Notes

This repository only encapsulates the back-end of the project. To check the front-end code of this project please refer to:

https://github.com/alexandermayorga/petscraper-client