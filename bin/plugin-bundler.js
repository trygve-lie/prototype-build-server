import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import esbuild from "esbuild";
import etag from '@fastify/etag';
import fp from 'fastify-plugin';

const require = createRequire(import.meta.url);

const build = async ({ entryPoints = [] } = {}) => {
    const result = await esbuild.build({
        resolveExtensions: ['.js', '.ts'],
        legalComments: 'none',
        entryPoints,
        charset: 'utf8',
        plugins: [],
        target: 'esnext',
        bundle: true,
        format: "esm",
        outdir: `${tmpdir()}/podlet-name`,
        minify: true,
        write: false,
    });
    return result.outputFiles[0].text;
}

export default fp((fastify, {
    cwd = process.cwd(),
} = {}, next) => {

    fastify.register(etag, {
        algorithm: 'fnv1a'
    });

    fastify.get('/_/dynamic/modules/*', async (request, reply) => {
        const depname = request.params['*'];
        const filepath = require.resolve(depname, { paths: [cwd] });

        const body = await build({
            entryPoints: [filepath],
        });

        reply.type("application/javascript");
        reply.send(body);
    });

    fastify.get('/_/dynamic/files/:file.js', async (request, reply) => {        
        const filename = request.params['file'];

        const body = await build({
            entryPoints: [`${cwd}/src/${filename}`],
        });

        reply.type("application/javascript");
        reply.send(body);
    });

    next()
}, {
  fastify: '4',
  name: 'plugin-bundler'
})