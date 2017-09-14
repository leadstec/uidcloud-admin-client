'use strict';

const privates = require('./private-map');
const members = require('./group-members');
const request = require('request');

/**
 * @module users
 */

module.exports = {
  find: find,
  create: create,
  remove: remove, 
  members: members
};

/**
  Get group hierarchy. Only name and ids are returned.

  @param {string} realmName - The name of the realm(not the realmID) - ex: master
  @returns {Promise} A promise that will resolve with an Array of group objects
  @example
  uidcloudAdminClient(settings)
    .then((client) => {
      client.groups.find(realmName)
        .then((groupList) => {
          console.log(groupList) // [{...},{...}, ...]
        })
      });
 */
function find (client) {
  return function find (realm, options) {
    return new Promise((resolve, reject) => {
      const req = {
        auth: {
          bearer: privates.get(client).accessToken
        },
        json: true,
      };
      
      if (options.groupId) {
        req.url = `${client.baseUrl}/admin/realms/${realm}/groups/${options.groupId}`;
      } else {
        req.url = `${client.baseUrl}/admin/realms/${realm}/groups`;
        req.qs = options;
      }

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
  A function to create a new group for a realm.
  @param {string} realmName - The name of the realm(not the realmID) - ex: master
  @param {object} group - The JSON representation of a group - groupname must be unique
  @returns {Promise} A promise that will resolve with the user object
  @example
  uidcloudAdminClient(settings)
    .then((client) => {
      client.groups.create(realmName, group)
        .then((createdGroup) => {
        console.log(createdGroup) // [{...}]
      })
    })
 */
function create (client) {
  return function create (realm, group, options) {
    return new Promise((resolve, reject) => {
      const req = {
        auth: {
          bearer: privates.get(client).accessToken
        },
        body: group,
        method: 'POST',
        json: true
      };
      
      if (options.parentId) {
        req.url = `${client.baseUrl}/admin/realms/${realm}/groups/${options.parentId}/children`;
      } else {
        req.url = `${client.baseUrl}/admin/realms/${realm}/groups`;
        req.qs = options;
      }            

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 201) {
          return reject(body);
        }

        // eg "location":"https://<url>/auth/admin/realms/<realm>/groups/499b7073-fe1f-4b7a-a8ab-f401d9b6b8ec"
        const gid = resp.headers.location.replace(/.*\/(.*)$/, '$1');

        // Since the create Endpoint returns an empty body, go get what we just imported.
        // *** Body is empty but location header contains user id ***
        // We need to search based on the userid, since it will be unique
        return resolve(client.groups.find(realm, {
          groupId: gid
        })
          .then((group) => {
            return group[0];
          }));
      });
    });
  };
}


/**
  A function to delete a group in a realm
  @param {string} realmName - The name of the realm(not the realmID) to delete - ex: master,
  @param {string} groupId - The id of the group to delete
  @returns {Promise} A promise that resolves.
  @example
  uidcloudAdminClient(settings)
    .then((client) => {
      client.groups.remove(realmName, groupId)
        .then(() => {
          console.log('success')
      })
    })
 */
function remove (client) {
  return function remove (realmName, groupId) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${client.baseUrl}/admin/realms/${realmName}/groups/${groupId}`,
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