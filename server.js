const express = require('express'),
      port = 8080,
      StreamChat = require('stream-chat').StreamChat,
      app = express();

      app.use(express.json());
      const serverClient = StreamChat.getInstance('naxjxu3wf5ez','6fpupw3xpznyjq5b79c2c7yu64etkpxzzsp6v8tg72z8vemmay72rsrru96q4jxa');

      app.get('/', async(req, res)=> {
        res.status(200).json({
            success: true,
            message: 'API Start'
        });
      });

      app.post('/create', async(req, res)=> {
        const {name,id}=req.body;
        const token = serverClient.createToken(id);
        try{
          const response = await serverClient.upsertUser({
            id,
            name,
            role:'user'
          })
          res.status(200).json({
            success: true,
            ...response.users[`${id}`],
            token: token
          });
        }catch(err){
           console.log(err);
           res.status(400).json({
            success: false,
            message: 'some thing went wrong!',
          });
        }
      });

      app.get('/token/:id', async(req, res)=> {
        try{
          const token = serverClient.createToken(req.params.id);
          res.status(200).json({
            success: true,
            token: token,
          });
        }catch(err){  
          console.log(err);
           res.status(400).json({
            success: false,
            message: 'some thing went wrong!',
          });
        }
      })
    
      app.listen(port,()=> console.log(`listen on ${port}`));