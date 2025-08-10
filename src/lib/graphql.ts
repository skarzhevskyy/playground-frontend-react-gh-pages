import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient('https://swapi-graphql.netlify.app/graphql');

export const GET_ALL_FILMS = `
  query GetAllFilms {
    allFilms {
      films {
        id
        title
        director
        releaseDate
        producers
        episodeID
        openingCrawl
        created
        edited
      }
    }
  }
`;

export const GET_SCHEMA = `
  query IntrospectionQuery {
    __schema {
      types {
        name
        fields {
          name
          description
          type {
            name
            kind
          }
        }
      }
    }
  }
`;

export interface Film {
  id: string;
  title: string;
  director: string;
  releaseDate: string;
  producers: string[];
  episodeID: number;
  openingCrawl: string;
  created: string;
  edited: string;
}

export interface FilmsResponse {
  allFilms: {
    films: Film[];
  };
}

export interface SchemaField {
  name: string;
  description: string;
  type: {
    name: string;
    kind: string;
  };
}

export interface SchemaType {
  name: string;
  fields: SchemaField[];
}

export interface SchemaResponse {
  __schema: {
    types: SchemaType[];
  };
}