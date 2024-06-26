/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as functions from "firebase-functions";
import * as express from "express";
import {join} from "path";
import {readFileSync} from "fs";
// // Import Angular Universal server module
import {ngExpressEngine} from "@nguniversal/express-engine";
import * as provideModuleMap from "@nguniversal/module-map-ngfactory-loader";
// // Import the main server module
import {AppServerModuleNgFactory} from "./dist/metaDetective/server";
import {LAZY_MODULE_MAP} from "./dist/metaDetectiveserver/server/main";
import * as cors from "cors";
// // Import the main server module
// const app = express();
// // Set the engine
// app.engine("html", ngExpressEngine({
//   bootstrap: AppServerModuleNgFactory,
//   providers: [
//     provideModuleMap(LAZY_MODULE_MAP),
//   ],
// }));
// app.set("view engine", "html");
// app.set("views", join(__dirname, "dist/metaDetective/browser"));
// // Serve static files from /browser
// app.get("*.*", express.static(join(__dirname, "dist/metaDetective/browser")));
// // All regular routes use the Universal engine
// app.get("*", (req:any, res:any) => {
//   res.render("index", {req});
// });
// exports.ssr = functions.https.onRequest(app);
// # sourceMappingURL=index.js.map


// const functions = require("firebase-functions");
// const express = require("express");
// const { ngExpressEngine } = require("@nguniversal/express-engine");
// const { provideModuleMap } = require("@nguniversal/module-map-ngfactory-loader");
// const { join } = require("path");
// const cors = require("cors");
const app = express();

const distFolder = join(process.cwd(), "dist/metaDetective/browser");
const indexHtml = join(distFolder, "index.html");

app.use(cors());

app.engine("html", ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}));

app.set("view engine", "html");
app.set("views", distFolder);

app.get("*.*", express.static(distFolder, {
  maxAge: "1y",
}));

app.get("*", (req, res) => {
  res.render(indexHtml, {req});
});

exports.ssrFunction = functions.https.onRequest(app);
