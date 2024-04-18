const { decryptMedia } = require('@open-wa/wa-automate');
const axios = require('axios');

const cat = async () => {
  const APIURL = `https://api.thecatapi.com/v1/images/search`;
  const { data } = await axios.get(APIURL);
  const picUrl = data[0].url;
  if (!picUrl) return undefined;
  return picUrl;
};

const dog = async () => {
  const APIURL = `https://dog.ceo/api/breeds/image/random`;
  const { data } = await axios.get(APIURL);
  const picUrl = data.message;
  if (!picUrl) return undefined;
  return picUrl;
};


module.exports = {
  cat,
  dog,
};