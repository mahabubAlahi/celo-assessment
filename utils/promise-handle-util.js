/*
* @param {Promise} promise
* @returns {Promise} [ data, undefined ]
* @returns {Promise} [ undefined, Error ]
*/
const handle = (promise) => {
   return promise
     .then(data => ([data, undefined]))
     .catch(error => Promise.resolve([undefined, error]));
}


module.exports = {
    handle
}