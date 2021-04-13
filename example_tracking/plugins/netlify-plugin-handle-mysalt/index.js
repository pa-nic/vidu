const fs = require('fs');
const crypto = require('crypto');

// Salt file name defined in netlify.toml
const getResourcesFile = ({ inputs }) => {
  return `./functions/utils/${inputs.filename}.js`;
}

// Create new salt
const createNewSalt = () => {
  let salt =  crypto.randomBytes(16).toString('hex');
  let content = `module.exports.salt = '${salt}'`;
  return content;
}

module.exports = {
  async onPreBuild({ utils, inputs }) {
    const file = getResourcesFile({ inputs });
    if (process.env.INCOMING_HOOK_BODY == 'refreshsalt') {
      // Create file with new salt on scheduled build hook
      fs.writeFileSync(file,createNewSalt());
      console.log(`Created file "${file}" with updated salt`);
    } else {
      // Restore cached salt file on defaul build
      const success = await utils.cache.restore(file);
      console.log(`Checking if file ${file} exists`);

      if (success) {
        console.log(`Restored ${file} from cached`);
      } else {
        // If restoring cached file fails, create new
        console.log(`No cache found for requested file. Create new salt file`);
        fs.writeFileSync(file,createNewSalt());
        console.log(`Created new file "${file}" with salt`);
      }
    }
  },

  async onPostBuild({ utils, inputs }) {
    const file = getResourcesFile({ inputs });
    // Cache salt file
    const success = await utils.cache.save(file);
    if (success) {
      console.log(`Saved ${file} file to cache`);
    } else {
      console.log(`No file cached`);
    }
  }
};