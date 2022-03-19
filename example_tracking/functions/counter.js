const faunadb = require('faunadb');
const bowser = require('bowser');
const crypto = require('crypto');
const language = require("./utils/languagecodes");
const { salt } = require('./utils/salt');

exports.handler = async (event) => {
  const q = faunadb.query;
  const { headers } = event;
  // We will use the referer to know which page we want to track.
  const referer = headers['referer'];
  const url = new URL(referer);
  const { hostname } = url;
  const { pathname } = url;
  // User agend header parsing
  const useragent = headers['user-agent'];
  // Client IP
  let clientIP = headers['x-nf-client-connection-ip'];

  /* BEGIN # Track only if NOT bot/crawler, localhost and netlify deploy server */

  if ( !(/bot|crawler|HeadlessChrome|spider|crawling/i).test(useragent) && clientIP !== '127.0.0.1' && clientIP !== '::1') {

    const browser = bowser.getParser(useragent);
    // Create browser details object
    const clientBrowser = browser.getBrowser();
    // // Create OS details object
    const clientOS = browser.getOS();
    // // Decode client language
    const clientLanguage = language[headers['accept-language'].substring(0,2)];
    // Anonymize IPv4 by removing the last byte
    if (clientIP.includes('.')) {
      clientIP = clientIP.substring(0, clientIP.lastIndexOf('.'));
    }
    // Anonymize IPv6 by removing the last 64 bits
    if (clientIP.includes(':')) {
      clientIP = clientIP.substring(0, clientIP.lastIndexOf(':'));
    }
    // Create hash with daily salt to create anon ID
    const id = crypto.createHash('sha256').update(`${ salt }${ clientIP }${ hostname }${ pathname }${ useragent }`).digest('hex');
    // Connect to our database.
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SECRET
    });
    
    try {
      await client.query(
        q.Create(q.Collection('hits'), {
          data: { 
            id: id, 
            url: referer, 
            browser_name: clientBrowser.name, 
            browser_version: clientBrowser.version,
            os_name: clientOS.name, 
            os_version: clientOS.version, 
            os_versionName: clientOS.versionName, 
            language: clientLanguage, 
            time: q.Now() }
        })
      );
    } catch (error) {
      console.error(error);
    }

  }

  /* END */

  // We respond with a transparent image
  return {
    statusCode: 200,
    body: 'R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==',
    headers: { 'content-type': 'image/gif' },
    isBase64Encoded: true
  };
};