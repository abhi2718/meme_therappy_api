const express = require('express'),
      port = 8080,
      stream = require('getstream');
      app = express();
      app.use(express.json());
      const client = stream.connect(
        'umn9bfznh9ay',
        'ja9qa2ac8tmendx3sn2jfggg9pnfvh7mngk5pr6w9q3dr9e8kmx2946284bd64nz',
        '1210354',
        { location: 'Singapore' },
      );

      app.get('/', async(req, res)=> {
        console.log(token);
        res.status(200).json({
            success: true,
            message: 'API Start'
        });
      });

      app.post('/create/user', async(req, res)=> {
        const {name,occupation,gender,id}=req.body;
        try{
          const user= await client.user(id).create({
            name,
            occupation,
            gender,
          });
          res.status(200).json({
            success: true,
            token: user.token,
            id: user.id,
            data: user.data,
          });
        }catch(err){
           console.log(err);
           res.status(400).json({
            success: false,
            message: 'some thing went wrong!',
          });
        }
      });

      app.get('/users/:id', async(req, res)=> {
          const user = await client.user(req.params.id).get();
          res.status(200).json({
            success: true,
            token: user.token,
            id: user.id,
            data: user.data,
          });
      })
      app.get('/create/feedgroup/:id',async(req, res)=> {
        try{
          const user = await client.feed('public', req.params.id);
          console.log(user);
          res.status(200).json({
            success: true,
            token: user.token,
            id: user.id,
            slug: user.slug,
            userId: user.userId,
            feedUrl: user.feedUrl,
            feedTogether: user.feedTogether,
            notificationChannel: user.notificationChannel,
          });
        }catch(err){
          console.log(err);
          res.status(400).json({
            success: false,
            message: 'Invalid request parameters'
          });
        }
      })

      app.post('/create/feed/',async(req, res)=> {  
        try{
          const {userId,userToken}=req.body;
          const user = client.feed('user', userId, userToken);
          const activity = {
            actor:userId,
            verb: "post",
            object: "text:9",
            foreign_id: userId,
            time: new Date(),
            tweet: 'message',
            popularity: 1,
            to: ["global:all"],
         };
          const feed=await user.addActivity(activity);
          res.status(200).json({
            success: true,
            feed,
          });
        }catch(err){
          console.log(err);
          res.status(400).json({
            success: false,
            message: 'Invalid request parameters'
          });
        }
      })
      app.post('/getfeed',async(req, res)=> {
        try{
          const {userId,userToken}=req.body;
          const user =  client.feed('global', userId,);
          user.get()
          .then((data)=>{
            console.log(data);
            res.status(200).json({  
              success: true,
              feed:data.results
            });
          })
          .catch((error)=>{
            console.log(error);
            res.status(400).json({
              success: false,
              message: 'Invalid request parameters'
            });
          });
        }catch(err){
          console.log(err);
          res.status(400).json({
            success: false,
            message: 'Invalid request parameters'
          });
        }
      })
      
      app.post('/flow',async(req, res)=>{
        const {userId,userToken,followId}=req.body;
        try{
          const user= client.feed('user', userId, userToken);
          const response= await user.follow('user', followId);
          console.log('response',response);
          res.status(200).json({
            success: true,
          })
        }catch(error){
          res.status(400).json({
            success: false,
          })
        }
      })
      app.listen(port,()=> console.log(`listen on ${port}`));