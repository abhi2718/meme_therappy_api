const stream = require('getstream-node');
const express = require('express'),
      port = 8080,
      connectToDb = require('./models'),
      mongoose = require('mongoose'),
      app = express();
      connectToDb();

      const userSchema = new mongoose.Schema({
        name: String,
        email: String,
      });
      const User= mongoose.model('User',userSchema);
      const tweetSchema = new mongoose.Schema({
        text    : String,
        user   : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      },{
		collection: 'User',
	   });
      tweetSchema.plugin(stream.mongoose.activity);
      const Tweet = mongoose.model('Tweet', tweetSchema);
      stream.mongoose.setupMongoose(mongoose);

      app.get('/', async(req, res)=> {
        res.status(200).json({
            success: true,
            message: 'API Start'
        });
      });

      app.get('/signup', async(req, res)=> {
             try {
                const user= await User.create({
                    name: 'Abhi',
                    email: 'abhi@gmail.com',
                });
                res.status(200).json({
                    success: true,
                    id:user._id,
                    name: user.name,
                    email: user.email,
                });
             }catch(err) {

             }
      });

      app.get('/tweet/:userId', async(req, res)=> {
        try {
           const tweet= await Tweet.create({
               text: 'new tweet',
               user: req.params.userId,
           });
           res.status(200).json({
               success: true,
               text:tweet.text,
           });
        }catch(err) {

        }
   });


      app.listen(port,()=> console.log(`listen on ${port}`));