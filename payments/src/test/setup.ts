import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51MP1roG3eNNSJH7dK4gDGpbM5o7XzlbTmyeJ2bJwtq4PGqUMSR86VKbaeTURJAwy3Pm1EMe6EJoiffNgFDf59ygE00eI09xxUz';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //build jwt payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //build session object {jwt: myjwt}
  const session = { jwt: token };
  //turn session into json
  const sessionJSON = JSON.stringify(session);
  //encode json as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return a string thaths the cookie with the encoded data
  return [`session=${base64}`];
};
