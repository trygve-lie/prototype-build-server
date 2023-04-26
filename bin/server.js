import fastify from 'fastify';

import bundler from "./plugin-bundler.js";
import reload from "./plugin-live-reload.js";

const app = fastify({ logger: true });

app.register(bundler, {});
app.register(reload, {});

app.get('/', async (request, reply) => {
    reply.type("text/html; charset=utf-8");
    return `<html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                <script src="/_/live/client" type="module"></script>
                <script src="/_/dynamic/files/content.js" type="module"></script>
            </head>
            <body>
                <h2>Hello ${Date.now()}</h2>
                <simple-test></simple-test>
            </body>
            </html>`;
});

try {
    await app.listen({ port: 3000 });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}