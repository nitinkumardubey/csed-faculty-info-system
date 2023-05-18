const mongoose = require('mongoose');

const db = process.env.db;

mongoose.set('strictQuery', true);
mongoose.connect(db, {
     useNewUrlParser: true,
     useUnifiedTopology: true
}).then(() => {
     console.log(`Connection successful`);
}).catch((err) => console.log(err));