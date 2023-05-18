const { Router } = require("express");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Authenticate = require('../middleware/authenticate');
const ObjectId = require('mongodb').ObjectId;
require('../db/conn');
const User = require('../model/userSchema');
const { find } = require('../model/userSchema');

// router.get('/', (req, res) => {
//      res.send('Hello');
// });

router.post('/register', async (req, res) => {
     // res.send('hellor register');
     const { email, name, desgn, password, image } = req.body;
     // const phone = "";
     // res.send(email + "" + name + "" + desgn + "" + password + "" + image);
     if (!name || !email || !desgn || !password || !image) {
          return res.status(422).json({ error: "Please fill all the fields" });
     }
     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               return res.status(422).json({ error: "User already existed" });
          }
          // else if (password != cpassword) {
          //      res.status(422).json({ error: "Password does't matching" });
          // }
          else {
               const user = new User({ name, email, desgn, password, image });
               await user.save();
               res.status(200).json({ message: "User Registered Successfully" });
          }
     } catch (err) {
          console.log(err);
     }
});

router.get('/allfaculty', async (req, res) => {
     try {
          const alldata = await User.find({});
          res.send({ data: alldata });
     } catch (error) {
          console.log(error);
     }
});

router.get('/facinfo', async (req, res) => {
     try {
          const alldata = await User.findOne({ email: email });
          res.send({ data: alldata });
     } catch (error) {
          console.log(error);
     }
});


router.get('/homepage', (req, res) => {
     res.send('hello homepage');
});

// router.get('/login', (req, res) => {
//      res.send('Hello login');
// });

router.get('/getdata', Authenticate, (req, res) => {
     res.send(req.rootUser);
});

router.post('/login', async (req, res) => {
     try {
          const { email, password } = req.body;
          if (!email || !password) {
               return res.status(422).json({ error: "Please fill all fields" });
          }
          const userLogin = await User.findOne({ email: email });
          if (userLogin) {
               const ismatch = await bcrypt.compare(password, userLogin.password);
               if (ismatch) {
                    const token = await userLogin.generateAuthToken();
                    console.log(token);
                    res.cookie("jwtoken", token, {
                         expires: new Date(Date.now() + 25892000000),
                         httpOnly: true
                    });
                    res.json("Signin Successfully");
               }
               else {
                    res.status(422).json("Invalid Credentials");
               }
          }
          else {
               res.status(422).json("Invalid Credentials");
          }
     } catch (error) {
          console.log(error);
     }
});

router.post('/facultyupdateprofile', async (req, res) => {
     // res.send('hellor register');
     const { email, name, desgn, imaged, phone, latestQ, joingD, natureofassociation, specialisation, areasofinterest, education, experience } = req.body;
     // res.send(email + "" + name + "" + desgn + "" + password + "" + image);
     // if (!email || !phone) {
     //      return res.status(422).json({ error: "Please fill all the fields" });
     // }
     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               const up = await User.findOneAndUpdate({ email }, { name: name, desgn: desgn, phone: phone, image: imaged, joingD: joingD, latestQual: latestQ, natureofassociation: natureofassociation, specialisation: specialisation, areaofinterest: areasofinterest, education: education, experience: experience });
               if (up) {
                    return res.status(200).json({ message: "Profile updated successfully" });
               }
          }
          else {
               res.status(422).json({ error: "Profile not updated" });
          }
     } catch (err) {
          console.log(err);
     }
});

router.post('/editpub', async (req, res) => {
     const { email, title, id, author, year, link } = req.body;
     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               const up = await User.findOneAndUpdate({ "publication._id": id }, { 'publication.$.title': title, 'publication.$.author': author, 'publication.$.year': year, 'publication.$.link': link });
               if (up) {
                    return res.status(200).json({ message: "Publication edited successfully" });
               }
          }
          else {
               res.status(422).json({ error: "Publication not edited" });
          }
     } catch (err) {
          console.log(err);
     }
});

router.post('/editclass', async (req, res) => {
     const { email, topic, id, course, yearrr, semester } = req.body;
     let year = yearrr;
     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               const up = await User.findOneAndUpdate({ "class._id": id }, { 'class.$.topic': topic, 'class.$.semester': semester, 'class.$.year': year, 'class.$.course': course });
               if (up) {
                    return res.status(200).json({ message: "Class edited successfully" });
               }
          }
          else {
               res.status(422).json({ error: "Class not edited" });
          }
     } catch (err) {
          console.log(err);
     }
});


router.post('/forgotp', async (req, res) => {
     const { email, password } = req.body;
     let ppassword = await bcrypt.hash(password, 12);
     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               const up = await User.findOneAndUpdate({ email: email }, { password: ppassword });
               if (up) {
                    return res.status(200).json({ message: "Password updated successfully" });
               }
          }
          else {
               res.status(422).json({ error: "User not found" });
          }
     } catch (err) {
          console.log(err);
     }
});

router.post('/facdelete', async (req, res) => {
     const { eemail } = req.body;
     let email = eemail;
     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               const up = await User.findOneAndDelete({ email: email });
               if (up) {
                    return res.status(200).json({ message: "Faculty profile deleted successfully" });
               }
          }
          else {
               res.status(422).json({ error: "Faculty Profile not found" });
          }
     } catch (err) {
          console.log(err);
     }
});


router.post('/deletepub', async (req, res) => {
     const { email, id, title } = req.body;
     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               const userpublication = await User.findOneAndUpdate({ "publication._id": id }, { 'publication.$.title': "1", 'publication.$.author': "1", 'publication.$.year': "1", 'publication.$.link': "1" });
               if (userpublication) {
                    return res.status(200).json({ message: "Publication deleted successfully" });
               }
          }
          else {
               res.status(422).json({ error: "Publication not deleted" });
          }
     } catch (err) {
          console.log(err);
     }
});


router.post('/deleteclass', async (req, res) => {
     const { email, id, topic } = req.body;
     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               const userpublication = await User.findOneAndUpdate({ "class._id": id }, { 'class.$.topic': "1", 'class.$.course': "1", 'class.$.semester': "1", 'class.$.year': "1" });
               if (userpublication) {
                    return res.status(200).json({ message: "Class deleted successfully" });
               }
          }
          else {
               res.status(422).json({ error: "Class not deleted" });
          }
     } catch (err) {
          console.log(err);
     }
});

router.post('/profileinfo', async (req, res) => {
     try {
          const { email } = req.body;
          const userLogin = await User.findOne({ email: email });
          if (userLogin) {
               res.send(userLogin);
          }
          else {
               res.status(422).json("Invalid Credentials");
          }
     } catch (error) {
          console.log(error);
     }
});

router.post('/publicationadd', Authenticate, async (req, res) => {
     try {
          const { title, author, year, link } = req.body;
          if (!title || !author || !year || !link) {
               return res.status(422).json({ error: "Please fill the contact form" });
          }
          const userpublication = await User.findOne({ _id: req.userID });
          // console.log(userpublication)
          if (userpublication) {
               const usermessage = await userpublication.addpublication(title, author, year, link);
               await userpublication.save();
               res.status(201).json({ message: "Publication added" });
          }
     }
     catch (error) {
          console.log(error);
     }
});

router.post('/afpublicationadd', Authenticate, async (req, res) => {
     try {
          const { email, title, author, year, link } = req.body;
          if (!title || !author || !year || !link) {
               return res.status(422).json({ error: "Please fill the contact form" });
          }
          const userpublication = await User.findOne({ email: email });
          // console.log(userpublication)
          if (userpublication) {
               const usermessage = await userpublication.addpublication(title, author, year, link);
               await userpublication.save();
               res.status(201).json({ message: "Publication added" });
          }
     }
     catch (error) {
          console.log(error);
     }
});

router.post('/classadd', Authenticate, async (req, res) => {
     try {
          const { topic, course, semester, yearrr } = req.body;
          let year = yearrr;
          if (!topic || !course || !semester || !year) {
               return res.status(422).json({ error: "Please fill the contact form" });
          }
          const userclass = await User.findOne({ _id: req.userID });
          // console.log(userpublication)
          if (userclass) {
               const usermessage = await userclass.addclass(topic, course, semester, year);
               await userclass.save();
               res.status(201).json({ message: "Class added" });
          }
     }
     catch (error) {
          console.log(error);
     }
});

router.post('/afclassadd', Authenticate, async (req, res) => {
     try {
          const { email, topic, course, semester, yearrr } = req.body;
          let year = yearrr;
          if (!topic || !course || !semester || !year) {
               return res.status(422).json({ error: "Please fill the contact form" });
          }
          const userclass = await User.findOne({ email: email });
          // console.log(userpublication)
          if (userclass) {
               const usermessage = await userclass.addclass(topic, course, semester, year);
               await userclass.save();
               res.status(201).json({ message: "Class added" });
          }
     }
     catch (error) {
          console.log(error);
     }
});


// router.post('/contact', Authenticate, async (req, res) => {
//      try {
//           const { name, email, phone, message } = req.body;
//           if (!name || !email || !phone || !message) {
//                return res.status(422).json({ error: "Please fill the contact form" });
//           }
//           const usercontact = await User.findOne({ _id: req.userID });
//           if (usercontact) {
//                const usermessage = await usercontact.addMessage(name, email, phone, message);
//                await usercontact.save();
//                res.status(201).json({ message: "user contact successfully" });
//           }
//      }
//      catch (error) {
//           console.log(error);
//      }
// });

router.get('/logout', (req, res) => {
     // console.log('Hello my Logout Page');
     res.clearCookie('jwtoken', { path: '/' });
     res.status(200).send('User logout');
});

module.exports = router;