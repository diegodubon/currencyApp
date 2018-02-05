function load_auth(username, db) {
  return new Promise((resolve, reject) => {
    db
      .collection('config')
      .find({}, { userAuth: 1 })
      .toArray((err, result) => {
        if (err) {
          reject(err);
        }
        if (result == null || result == '') {
          reject('No user found');
        } else {
          resolve(result);
        }
      });
  });
}

module.exports.findByUsername = function(username, cb, database) {
  load_auth(username, database)
    .then(result => {
      let userAuth;

      for (let i = 0; i < result.length; i++) {
        // console.log(result[i]);
        userAuth = result[i].userAuth;

        if (userAuth.api_key == username) {
          if (userAuth.enable) {
            userAuth = result[i].userAuth;
            // console.log(userAuth);
            return cb(null, userAuth);
          } else {
            console.log(`Not Authorized ${userAuth.api_key}`);
            return cb(null, null);
          }
        }
        return cb(null, null);
        userAuth = null;
      }
      if ((i = result.length - 1)) {
        console.log('finish looking on auth');

        if (userAuth == null) {
          return cb(null, null);
        }
      }
    })
    .catch(reject => {
      console.log(reject);
      return cb(null, null);
    });
};
