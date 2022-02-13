<p align="center"><img src="./public/images/logo.png" width="100"></p>

<p align="center">Vidu - Minimal (jamstack) web analytics</p>

<p align="center"><img src="https://user-images.githubusercontent.com/52470102/114470919-fd0e6480-9bef-11eb-82c2-177ec3c0e8f9.png"></p>

## About

This project was started for trying/learning the following tools and still end up with something useful (at least to me):

- [Svelte](https://svelte.dev) javascript-framework (Vidu SPA backend)
- [Netlify](https://netlify.com) static hosting
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) for user authentication with [GoTrueJS](https://github.com/netlify/gotrue)
- [Netlify Functions](https://docs.netlify.com/functions/overview/) AWS lambda functions for API calls
- [Fauna](https://fauna.com) as transactional database
- [GitHub Actions](https://docs.github.com/en/actions) to execute build hook of monitored web page to refresh encryption salt every day at midnight
- [Netlify Build Plugins](https://docs.netlify.com/configure-builds/build-plugins/) to retain encryption *salt* on normal builds and refresh it if build web hook is executed by GitHub action
- [Windi CSS](https://windicss.org) Next generation Tailwind CSS compiler

### Functionality

*Vidu* [see - /Esperanto/] consists of

- A [Netlify Function](https://docs.netlify.com/functions/overview/) that is included as "tracker" in your web pages to collect (anonymized) user data and sending these to a [Fauna](https://fauna.com) database.
- A [Svelte](https://svelte.dev) SPA which displays all the data in a simple yet beautiful dashboard.

### Disclaimer

This project was created for fun and educational purposes.

*Vidu*, in general, has no limitation on processing page hits. But keep in mind that by using it for highly frequented web pages you will most likely exceed the free plans of Netlify and Fauna.

Fork it. Extend it. It's "[unlicensed](./LICENSE)".

### Recommendation

If the above is the case or you've stumbled up-on this repository in search for a alternative web analytics tool, I may suggest you also take a look at these (more feature-rich) solutions:
- [Netlify Analytics](https://www.netlify.com/products/analytics/) Netlify's own analytics tool (SaaS)
- [Ackee](https://ackee.electerious.com) Node.js based analytics tool for those who care about privacy (self-hosted)
- [Fathom](https://usefathom.com) privacy-first alternative to Google Analytics (SaaS)

## Setup

I assume you already have a [Netlify](https://netlify.com) account.

### Setup Fauna DB and Vidu

1. **Create database**

If you don't have a Fauna account yet, sign up [here](https://dashboard.fauna.com/accounts/login). Create a new database by clicking the *New Database* button and filling in a name in the form that follows:

![image32](https://user-images.githubusercontent.com/52470102/114444235-e7d50e00-9bce-11eb-9b47-4b2315037452.png)

2. **Create a database key**

The *FAUNA_SECRET* for your database can be created in the Fauna dashboard by going to the *SECURITY* menu and clicking *NEW KEY*. Make sure to select the Admin role since our key requires full access to the database.

Fill in a name, press Save, and you will receive a new key. Make sure to copy it since you will only receive this key once. Since this key will have full access to your database, make sure to keep it somewhere safe.

![image16](https://user-images.githubusercontent.com/52470102/114444288-f8858400-9bce-11eb-807b-85eedf8495a2.png)

3. **Deploy repository to Netlify**

With your server key ready, you can easily clone this repo and deploy this app in a few seconds by clicking the deploy button. Fill out the form and enter your *FAUNA_SECRET*. The DB structure will be setup as pre-build task. See [bootstrap-db.js](./scripts/bootstrap-db.js) for details.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/pa-nic/vidu)

4. **Enable Identity**

Enable Netlify Identity feature on your newly deployed Netlify site. Otherwise adding users and logins wont work.

![visitor-access-identity-enable](https://user-images.githubusercontent.com/52470102/114446010-0936f980-9bd1-11eb-854b-ab3faf82d0c0.png)

5. **Configure emails sent during user registration and other actions**

Under *Site Settings* go to *Identity* - *Emails* and configure the templates as follows:

*Invitation template* **Path:** /email_templates/invitation.html<br/>
*Recovery template* **Path:** /email_templates/recover.html

6. **Set registration to invite only**

Under *Site Settings* go to *Identity* - *Overview* set *Registration preferences* to *Invite only*. You can then go to the *Identity* tab and invite/add your first user which should receive a confirmation email.

### Setup Tracking

For how to implement the tracking in your web page take a look at the [example](./example_tracking). Further details below.

**Do not forget** to add your *FAUNA_SECRET* to the environment variables of this Netlify web page, too!

#### Tracking Code

The tracking code calls a Netlify function which pushes the tracking data to your fauna database and returns a bas64 encoded transparent image.

```
<img src="/.netlify/functions/counter"
      alt=""
      width="0"
      height="0"
      hidden
      decoding="async"
      loading="eager" />
```

#### Netlify Function Node Dependencies

See [example: package.json](./example_tracking/package.json).

### Gathered Data

- URL of visited page
- Browser
- Browser version
- OS
- OS version number
- OS version name
- Client language
- Timestamp
- id

The *id* is an anonymized user string composed as follows:

### Anonymized ID

To compose the *id* the last byte of the tracked IP address is removed (the last 64bits if IPv6) and hashed (sha256) together with the above listed and *salted* data. As the URL is also included in the hash, you wont be able to track the browsing behavior of individuals across your page. See [example: counter.js](./example_tracking/functions/counter.js) for details.

The 16 bytes random *salt* is created **once** during page build by making use of a Netlify plugin([Example: netlify-plugin-handle-mysalt](./example_tracking/plugins/netlify-plugin-handle-mysalt)). If a *salt* was already present it will be restored from cache during a new page build.

Nevertheless, the *salt* is always kept separated and never stored in the database.

### Further Improve Anonymization

To further improve the anonymization of the gathered data you can setup a github workflow([Example: workflow](./example_tracking/.github/workflows/main.yml)) running a build hook to rebuild your web page every day at midnight (UTC). The above mentioned Netlify plugin will recognize that the page build was triggered by your build hook and in **this** case a **new** *salt* will be created during page build.

- Add a build hook under *Site Settings* - *Build & deploy* - *Build hooks*.
- Name it *refreshsalt* 
- Edit the [Example: workflow](./example_tracking/.github/workflows/main.yml) by adding the created url to it:

```
run: curl -X POST -d 'refreshsalt' <YOUR_BUILD_HOOK_URL>&trigger_title=Refreshing+salt+by+github+webhook
```

<p align="center" style="margin-top:80px">And that's just about it!</p>
