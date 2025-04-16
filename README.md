<p align="center" style="background-color: #FFCE54; color: #000; border: 1px solid #FCBB42; padding: 8px;">DEPRECATED</p>

<p align="center"><img src="./src/lib/images/logo.png" width="100"></p>

<p align="center">Vidu - Minimal (jamstack) web analytics</p>

<p align="center"><img src="https://user-images.githubusercontent.com/52470102/114470919-fd0e6480-9bef-11eb-82c2-177ec3c0e8f9.png"></p>

## About

This project was started for trying/learning the following tools and still end up with something useful (at least to me):

- [Svelte](https://svelte.dev) javascript-framework (SvelteKit)
- [Netlify](https://netlify.com) static hosting
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) for user authentication with [GoTrueJS](https://github.com/netlify/gotrue)
- [Netlify Functions](https://docs.netlify.com/functions/overview/) AWS lambda functions for API calls
- [Fauna](https://fauna.com) as transactional database
- [GitHub Actions](https://docs.github.com/en/actions) to execute build hook of monitored web page to refresh encryption salt every day at midnight
- [Netlify Build Plugins](https://docs.netlify.com/configure-builds/build-plugins/) to retain encryption *salt* on normal builds and refresh it if build web hook is executed by GitHub action
- [Tailwind CSS](https://tailwindcss.com) Next generation Tailwind CSS compiler

### DEPRECATED

<p style="background-color: #FFCE54; color: #000; border: 1px solid #FCBB42; padding: 8px;">Fauna is shutting down (May 30, 2025) and NETLIFY has declared its identity service deprecated, too. Therefor, this project is abandoned and I encourage you to switch to one of the (freely) available analytics solutions out there.</p>

### Functionality

*Vidu* [see - /Esperanto/] consists of

- A [Netlify Function](https://docs.netlify.com/functions/overview/) that is included as "tracker" in your web pages to collect (anonymized) user data and sending these to a [Fauna](https://fauna.com) database.
- A [SvelteKit](https://svelte.dev) web app which displays all the data in a simple yet beautiful dashboard.

### Disclaimer

This project was created for fun and educational purposes.

*Vidu*, in general, has no limitation on processing page hits. But keep in mind that by using it for highly frequented web pages you will most likely exceed the free plans of Netlify and Fauna.

Fork it. Extend it. It's "[unlicensed](./LICENSE)".

## Setup

I assume you already have a [Netlify](https://netlify.com) account.

### Setup Fauna DB and Vidu

1. **Create database**

If you don't have a Fauna account yet, sign up [here](https://dashboard.fauna.com/accounts/login). 
Create a new database.

2. **Create a database key**

The *FAUNA_SECRET* for your database can be created in the Fauna dashboard by selecting your just created databse and browsing to *Keys*. 

Select *Create Key*. Fill in a name, select role *server*, press Save, and you will receive a new key. Make sure to copy it since you will only receive this key once.

3. **Create a collection**

Create a new collection under your database name with the name *hits* (you can keep the default settings).
Select the collection and to the *Schema* section and over-write its content with the following schema. Save.

```
collection hits {
  history_days 0
  ttl_days 2555
  compute date:Date = (
    doc => Date(doc.time.toString().slice(0, 10))
  )
  compute os = (
    doc => {
      if(doc.os_name != null) {
        if(doc.os_versionName != null) {
          doc.os_name + " " + doc.os_versionName
        } else (doc.os_name)
      } else("unknown")
    } 
  )
  compute year:Number = (
    doc => doc.time.year
  )
  compute month:Number = (
    doc => doc.time.month
  )
  index byDate {
    terms [.date]
    values [ .date ]
  }
  index byYear {
    terms [.year]
    values [ .date ]
  }
  index byYearByMonth {
    terms [.year, .month]
    values [ .date ]
  }
}
```

4. **Deploy repository to Netlify**

With your server key ready, you can easily clone this repo and deploy this app in a few seconds by clicking the deploy button. Fill out the form and enter your *FAUNA_SECRET*.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/pa-nic/vidu)

5. **Enable Identity**

Enable Netlify Identity feature on your newly deployed Netlify site. Otherwise adding users and logins wont work.


6. **Configure emails sent during user registration and other actions**

Under *Site Settings* go to *Identity* - *Emails* and configure the templates as follows:

*Invitation template* **Path:** /email_templates/invitation.html<br/>
*Recovery template* **Path:** /email_templates/recover.html

7. **Set registration to invite only**

Under *Site Settings* go to *Identity* - *Overview* set *Registration preferences* to *Invite only*. You can then go to the *Identity* tab and invite/add your first user which should receive a confirmation email.

### Setup Tracking

For how to implement the tracking in your web page take a look at the [example](./example_tracking). Further details below.

**Check** your *FAUNA_SECRET* is configured correctly as an environment variable for this Netlify web page!

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
