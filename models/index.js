const mongoose = require('mongoose');

const connectToDb = async()=>{
    const uri = 'mongodb+srv://abhishek123:abhishek123@cluster0.1kbo88a.mongodb.net/test?retryWrites=true&w=majority';
    try{
        const db = await mongoose.connect(uri);
    }catch(e){ 
         console.log(e);
     }
}

module.exports = connectToDb;