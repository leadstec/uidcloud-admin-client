'use strict';

const privates = require('./private-map');
const request = require('request');

/**
 * @module users
 */

module.exports = {
  find: find,
  add: add,
  remove: remove
};

/**
  Returns a list of user's groups, filtered according to query parameters

  @param {string} realmName - The name of the realm(not the realmID) - ex: master
  @param {string} userId - Id of the users
  @returns {Promise} A promise that will resolve with an Array of user's group objects
  @example
  uidcloudAdminClient(settings)
    .then((client) => {
      client.users.groups.find(realmName, userId)
        .then((groups) => {
          console.log(groups) // [{...},{...}, ...]
        })
      });
 */
function find (client) {
  return function find (realm, userId) {
    return new Promise((resolve, reject) => {
      const req = {
        auth: {
          bearer: privates.get(client).accessToken
        },
        json: true,
        url: `${client.baseUrl}/admin/realms/${realm}/users/${userId}/groups`
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 200) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
}

/**
  A function to add a user to a group
  @param {string} realmName - The name of the realm(not the realmID) - ex: master,
  @param {string} userId - The id of the user
  @returns {Promise} A promise that resolves.
  @example
  uidcloudAdminClient(settings)
    .then((client) => {
      client.users.groups.add(realmName, userId, groupId)
        .then(() => {
          console.log('success')
      })
    })
 */
function add (client) {
  return function add (realmName, userId, groupId) {
    return new Promise((resolve, reject) => {
      user = user || {};
      const req = {
        url: `${client.baseUrl}/admin/realms/${realmName}/users/${userId}/groups/${groupId}`,
        auth: {
          bearer: privates.get(client).accessToken
        },
        json: true,
        method: 'PUT',
        body: ''
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        // Check that the status cod
        if (resp.statusCode !== 204) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
}

/**
  A function to delete a user from a group
  @param {string} realmName - The name of the realm(not the realmID) to delete - ex: master,
  @param {string} userId - The id of the user to delete
  @param {string} groupId - The id of the group
  @returns {Promise} A promise that resolves.
  @example
  uidcloudAdminClient(settings)
    .then((client) => {
      client.users.groups.remove(realmName, userId, groupId)
        .then(() => {
          console.log('success')
      })
    })
 */
function remove (client) {
  return function remove (realmName, userId, groupId) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${client.baseUrl}/admin/realms/${realmName}/users/${userId}/groups/${groupId}`,
        auth: {
          bearer: privates.get(client).accessToken
        },
        method: 'DELETE'
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        // Check that the status code is a 204
        if (resp.statusCode !== 204) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
}