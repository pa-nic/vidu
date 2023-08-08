import { navigate } from "svelte-routing";

/**
 * Reads the URL hash attempts and tries to detect if there is confirmation tokens from an email signup or
 * invite. If present it will call the relevant process to attempt to authorize the token.
 */
export function detectTokens() {
  const params = getParams();

  if (params.has("invite_token")) {
    // console.log("found invite token", params.get("invite_token"));
    confirmInviteToken(params.get("invite_token"));
    return;
  } else if (params.has("recovery_token")) {
    // console.log("found recovery token", params.get("recovery_token"));
    confirmRecoveryToken(params.get("recovery_token"));
    return;
  }
}

/**
 * Extract params from URL
 */
export function getParams() {
  try {
    const params = new URLSearchParams(document.location.search);
    return params;
  } catch (error) {
    console.error(
      "Something went wrong when trying to extract params from URL.", error);
    return null;
  }
}

function confirmInviteToken(token) {
  navigate(`/signup?t=${token}`);
}

function confirmRecoveryToken(token) {
  navigate(`/reset_pwd?t=${token}`);
}

export default { detectTokens, getParams }
