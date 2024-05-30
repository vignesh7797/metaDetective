import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import * as cors  from 'cors';

import { AppServerModule } from './src/main.server';
import { AxiosRequestConfig } from 'axios';
import { handler } from './handler';

import { environment } from './src/environments/environment'

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const websiteFileLocation = environment.production ? "browser" : "dist/metaDetective/browser";
  server.use(cors());
  const distFolder = join(process.cwd(), websiteFileLocation);
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/api/**', handler);

  server.get('/api/meta-tags', async (req, res) => {
    const { url } = req.query;

    try {

      const axios = require('axios');
      const cheerio = require('cheerio');
      const config: AxiosRequestConfig = {headers : {'Access-Control-Allow-Origin': "*"}}
      const response = await axios.get(url, config);
      const html = response.data;
      const $ = cheerio.load(html);

      const metaTags: any = {};
      $('meta').each((i: any, elem: any) => {
        const name = $(elem).attr('name') || $(elem).attr('property');
        const content = $(elem).attr('content');
        if (name && content) {
          metaTags[name] = content;
        }
      });

        metaTags["title"] = $("title").text();

      res.json(JSON.stringify(metaTags));

    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch meta tags' });
    }
  })

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
