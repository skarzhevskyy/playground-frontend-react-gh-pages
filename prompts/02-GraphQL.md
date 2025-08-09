# Use GraphQL to display dynamic data

- Add a page that displays Star Wars films in a grid table
- Link to the page from the Welcome page
- Grid should have sorting and filtering for title, director, and release date
- Use GraphQL to fetch data from the Star Wars SWAPI GraphQL API
- Endpoint https://swapi-graphql.netlify.app/graphql
- GraphQL is in the file star-wars-swapi.graphql
- Use Query allFilms films and show by default: title, director, releaseDate
- The list of columns in gird should be dynamic, configurable in UI based on GraphQL schema that is loaded from the server
- Columns can be added or removed by user, Example columns: producers, id, 
- Grid should be responsive and work on mobile
- Grid should be paginated with 3, 5, and 10 items per page
- Use Tailwind CSS for styling
- Use Playwright for E2E tests and create a simple test to filter by title 'Jedi' and check if the results contain 'Return of the Jedi'
