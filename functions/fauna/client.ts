import { Client, fql } from "fauna";

const client = new Client({
    secret: process.env.FAUNA_SECRET,
    // keepAlive: false
});

export default {
    client,
    fql
}