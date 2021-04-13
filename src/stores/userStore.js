import { writable } from 'svelte/store';
import GoTrue from 'gotrue-js';
import { navigate } from "svelte-routing";

const goTrueInstance = new GoTrue({
  APIUrl: `.netlify/identity`,
  setCookie: false,
})

/**
 * Hydrate the user state instead of using localStorage for security reasons
 * https://dev.to/jeremywynn/using-netlify-identity-in-a-vue-spa-without-localstorage-23ob
 */
let goTrueUser = goTrueInstance.currentUser() || undefined;

export const authUserStore = writable(goTrueUser);
export const pendingIdentityCall = writable(false);

/**
 * Login
 * @param {*} email 
 * @param {*} password 
 */
export async function attemptLogin(email, password) {
  pendingIdentityCall.set(true);
  try {
    await goTrueInstance.login(email, password, true).then(user => {
      authUserStore.update(() => user);
      goTrueUser = goTrueInstance.currentUser();
      pendingIdentityCall.set(false);
      navigate("/", { replace: true });
    })
  } catch (e) {
    pendingIdentityCall.set(false);
    throw e.message;
  }
}

/**
 * Logout
 */
export async function attemptLogout() {
  try {
    await goTrueUser.logout().then(() => {
      authUserStore.update((user) => undefined)
      navigate("/", { replace: true });
    })
  } catch (e) {
    throw e.message;
  }
}

/**
 * ToDo invite token handling
 * @param {*} token 
 * @param {*} pwd 
 */
export async function processInvite (token, pwd) {
  pendingIdentityCall.set(true);
  try {
    await goTrueInstance.acceptInvite(token, pwd).then(() => {
      setTimeout(() => {
        pendingIdentityCall.set(false);
        navigate("/", { replace: true });
      }, 2000);
    })
  } catch (e) {
    pendingIdentityCall.set(false);
    throw e.message;
  }
}

/**
 * Request password recovery token email
 * @param {*} email 
 * @returns 
 */
export function requestPasswordRecovery (email) {
  return goTrueInstance.requestPasswordRecovery(email)
}

/**
 * Recovery token handling
 * @param {*} token 
 */
export async function processRecovery(token) {
  try {
    await goTrueInstance.recover(token).then(user => {
      authUserStore.update(() => user);
      goTrueUser = goTrueInstance.currentUser();
    })
  } catch (e) {
    throw e.message;
  }
}

/**
 * Reset user settings
 * @param {*} email 
 * @param {*} password 
 */
export async function updateUserSettings (email, password) {
  try {
    await goTrueUser.update({ email: email, password: password }).then(user => {
      authUserStore.update(() => user);
      goTrueUser = goTrueInstance.currentUser();
    })
  } catch (e) {
    throw e.message;
  }
}