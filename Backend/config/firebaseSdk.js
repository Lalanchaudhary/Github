const admin = require('firebase-admin');
const serviceAccount = require('./github-clone-966fd-firebase-adminsdk-p9zrr-8eb8525ffe.json'); // Path to your downloaded key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'github-clone-966fd.appspot.com'
});

console.log('Firebase connected successfully!');

const bucket = admin.storage().bucket();
console.log('Firestore connected successfully!');


module.exports = bucket;
