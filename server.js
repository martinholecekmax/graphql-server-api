import * as dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from './src/schema/index.js';
import { resolvers } from './src/resolvers/index.js';

import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { PubSub } from 'graphql-subscriptions';

import './src/db/mongodb.js';
import models from './src/models/index.js';

import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

const pubsub = new PubSub();

const Server = async () => {
  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: async () => ({
        pubsub,
      }),
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    graphqlUploadExpress(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.token,
        pubsub,
        models,
      }),
    })
  );

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

Server();
