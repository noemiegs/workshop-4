import bodyParser from 'body-parser';
import express from 'express';
import { BASE_USER_PORT } from '../config';

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

let lastReceivedMessage: string | null = null;
let lastSentMessage: string | null = null;

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  // Route pour le statut
  _user.get("/status/", (req, res) => {
    res.send("live");
  });

  // Route pour obtenir le dernier message reçu par l'utilisateur
  _user.get("/getLastReceivedMessage", (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  // Route pour obtenir le dernier message envoyé par l'utilisateur
  _user.get("/getLastSentMessage", (req, res) => {
    res.json({ result: lastSentMessage });
  });

  _user.post("/message", (req, res) => {
    const body = req.body as SendMessageBody;
    if (!body.message) {
      res.status(400).send("Invalid message");
      return;
    }
    lastReceivedMessage = body.message;
    res.status(200).send("success");
  });

  _user.post("/sendMessage", (req, res) => {
    const body = req.body as SendMessageBody;
    if (!body.message || !body.destinationUserId) {
      res.status(400).send("Invalid message or destinationUserId");
      return;}
    lastSentMessage = body.message;
    res.status(200).send("success");
  });


  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(`User ${userId} is listening on port ${BASE_USER_PORT + userId}`);
  });

  return server;
}
