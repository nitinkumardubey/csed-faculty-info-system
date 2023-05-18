const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true
     },
     desgn: {
          type: String,
          required: true
     },
     phone: {
          type: String
          // required: true
     },
     joingD: {
          type: String
          // required: true
     },
     latestQual: {
          type: String
          // required: true
     },
     natureofassociation: {
          type: String
          // required: true
     },
     specialisation: {
          type: String
          // required: true
     },
     areaofinterest: {
          type: String
          // required: true
     },
     education: [
          {
               name: {
                    type: String
                    // required: true
               }
          }
     ],
     experience: [
          {
               name: {
                    type: String
                    // required: true
               }
          }
     ],
     password: {
          type: String,
          required: true
     },
     image: {
          type: String,
          required: true
     },
     date: {
          type: Date,
          dafault: Date.now
     },
     publication: [
          {
               title: {
                    type: String,
                    required: true
               },
               author: {
                    type: String,
                    required: true
               },
               year: {
                    type: String,
                    required: true
               },
               link: {
                    type: String,
                    required: true
               }
          }
     ],
     class: [
          {
               topic: {
                    type: String,
                    required: true
               },
               course: {
                    type: String,
                    required: true
               },
               semester: {
                    type: String,
                    required: true
               },
               year: {
                    type: String,
                    required: true
               }
          }
     ],
     tokens: [
          {
               token: {
                    type: String,
                    required: true
               }

          }
     ]
})

userSchema.pre('save', async function (next) {
     if (this.isModified('password')) {
          this.password = await bcrypt.hash(this.password, 12);
          // this.cpassword = await bcrypt.hash(this.cpassword, 12);
     }
     next();
});
userSchema.methods.generateAuthToken = async function () {
     try {
          let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
          this.tokens = this.tokens.concat({ token: token });
          await this.save();
          return token;
     } catch (error) {
          console.log(error);
     }
};

// userSchema.methods.addMessage = async function (name, email, phone, message) {
//      try {
//           this.messages = this.messages.concat({ name, email, phone, message });
//           await this.save();
//           return this.messages;
//      }
//      catch (error) {
//           console.log(error);
//      }
// }

userSchema.methods.addpublication = async function (title, author, year, link) {
     try {
          this.publication = this.publication.concat({ title, author, year, link });
          await this.save();
          return this.publication;
     }
     catch (error) {
          console.log(error);
     }
}

userSchema.methods.addclass = async function (topic, course, semester, year) {
     try {
          this.class = this.class.concat({ topic, course, semester, year });
          await this.save();
          return this.class;
     }
     catch (error) {
          console.log(error);
     }
}

const User = mongoose.model('USER', userSchema);
module.exports = User;