const express = require('express');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const admin = require("firebase-admin");
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const db = getFirestore();

app.use(bodyParser.json());
app.use(cors());

app.post('/studentLogin',async (req, res) => {
    const {userName, password} =req.body;
    console.log(userName, password);
    db.collection('Students').where('userName','==', userName).where('password','==', password).get()
        .then((snapshot)=>{
            if(snapshot.empty){
                res.status(401).json({error:"Invalid username or password"});
            }else{
                const user = snapshot.docs[0].data();
                res.status(200).json({message:'login successful',userDetails:user});
            }
        })
        .catch((error)=>{
            console.log('error during login',error);
            res.status(500).json({error:'internal server error'});
        })

})

app.post('/update',async (req,res)=>{
    const userDetails=req.body;
    console.log(userDetails.userName)
    db.collection('Students').where("userName", "==",userDetails.userName).get()
        .then((snapshot)=>{
            //console.log(snapshot.docs[0].data());
            if(snapshot.empty){
                res.status(401).json({error:"Invalid username"});
            }else{
                snapshot.forEach((doc)=>{
                    doc.ref.update(userDetails);
                })
                res.status(200).json({message:'login successful',userDetails:userDetails});
            }
            
        })
        .catch((error)=>{
            console.log('error during login',error);
            res.status(500).json({error:'internal server error'});
        })
    })


    app.get('/getEvent', async (req, res) => {
        try {
            const snapshot = await db.collection('Events').get();
            
            if (snapshot.empty) {
                return res.status(404).json({ error: "No events found" });
            }
    
            const events = snapshot.docs.map(doc => ({
                ...doc.data()
            }));
    
            res.status(200).json({ message: 'Events retrieved successfully', events });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

app.post('/StudentAdmin', async (req, res) => {
    const { start, end } = req.body;
    const promises = [];
    for (let i = start; i < end; i++) {
        const userName = 'user' + (i < 10 ? '0' : '') + i;
        const promise = db.collection('Students').add({ userName, password: '1234' });
        promises.push(promise);
    }

    try {
        await Promise.all(promises);
        res.json('success');
    } catch (err) {
        console.error('Error adding student data:', err);
        res.json('error while adding student data');
    }
});




app.listen(8080, () => {
    console.log('server is running on http://localhost:8080');
});