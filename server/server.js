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

app.post('/teacherLogin',async (req, res) => {
    const {userName, password} =req.body;
    console.log(userName, password);
    db.collection('Teachers').where('userName','==', userName).where('password','==', password).get()
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
app.post('/apply', async (req, res) => {
  const userDetails = req.body;
  const { userName, EventName } = userDetails;

  if (!userName || !EventName) {
    return res.status(400).json({ error: "Missing userName or EventName" });
  }

  try {
    // First: Update user details
    const snapshot = await db.collection('Students').where("userName", "==", userName).get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid username" });
    }

    snapshot.forEach(doc => {
      doc.ref.update(userDetails);
    });

    // Second: Add event registration
    const registration = {
      userName,
      EventName,
      timestamp: new Date()
    };

    await db.collection('Applied').add(registration);
    
    res.status(200).json({
      message: "Apply successful",
      updatedUser: userDetails,
      registration
    });

  } catch (error) {
    console.error("Error during apply process", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


    
    app.post('/getEvent', async (req, res) => {
        const {EventName}=req.body;
        console.log(EventName);
        try {
            const snapshot = await db.collection("Events")
            .where("EventName", "==", EventName).get();
            //console.log(snapshot);
            if (snapshot.empty) {
                return res.status(404).json({ error: "No events found" });
            }
    
           
    
            res.status(200).json({ message: 'Events retrieved successfully', events:snapshot.docs[0].data() });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
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
    const students = req.body; 
    const promises = [];

    if (!Array.isArray(students)) {
        return res.status(400).json({ error: 'Invalid input. Expected an array of student records.' });
    }

    for (const student of students) {
       
        const { userName, password, name, branch, email } = student;
        if (!userName || !password || !name || !branch || !email) {
            console.warn('Skipping invalid student record:', student);
            continue; 
        }

        const promise = db.collection('Students').add(student);
        promises.push(promise);
    }

    try {
        await Promise.all(promises);
        res.json({ message: 'All students added successfully' });
    } catch (err) {
        console.error('Error adding student data:', err);
        res.status(500).json({ error: 'Error while adding student data' });
    }
});

app.post('/teacherEvent', async (req, res) => {
    const teacherDetails = req.body;
    const teacherName = teacherDetails.userName;

    
    if (!teacherName) {
        return res.status(400).json({ error: "Missing teacher username (userName)" });
    }

    try {
       
        const snapshot = await db.collection('Events')
            .where('PostedBy', '==', teacherName)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No events found for this teacher." });
        }

        
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            message: 'Events retrieved successfully',
            events
        });

    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/addEvent', async (req, res) => {
    const eventDetails = req.body;
    const teacherName = eventDetails.PostedBy;
    const eventName = eventDetails.EventName;

    try {
        
        const eventSnapshot = await db.collection('Events')
            .where('EventName', '==', eventName)
            .where('PostedBy', '==', teacherName)
            .get();

        
        const teacherSnapshot = await db.collection('Teachers')
            .where('userName', '==', teacherName)
            .get();

        if (!teacherSnapshot.empty && eventSnapshot.empty) {
            
            const addedEventRef = await db.collection('Events').add(eventDetails);

           
            const teacherDocId = teacherSnapshot.docs[0].id;

           
            await db.collection('Teachers').doc(teacherDocId).update({
                Events: admin.firestore.FieldValue.arrayUnion(eventDetails.EventName)
            });

            return res.status(200).json({
                message: 'Event added successfully and linked to teacher',
                eventDetails
            });
        } else {
            return res.status(401).json({ error: "Event with same name already exists or teacher not found" });
        }

    } catch (error) {
        console.error('Error adding event:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/getUsers', async (req, res) => {
    const { EventName } = req.body;

    if (!EventName) {
        return res.status(400).json({ error: "Missing EventName" });
    }

    try {
        // Step 1: Query Applied collection for users who applied to the event
        const appliedSnapshot = await db.collection('Applied')
            .where('EventName', '==', EventName)
            .get();

        if (appliedSnapshot.empty) {
            return res.status(404).json({ error: "No users found for this event" });
        }

        // Step 2: Get all userNames from applied users
        const userNames = appliedSnapshot.docs.map(doc => doc.data().userName);

        // Step 3: Get student details using userNames
        const students = [];
        for (const userName of userNames) {
            const studentSnapshot = await db.collection('Students')
                .where('userName', '==', userName)
                .get();

            if (!studentSnapshot.empty) {
                const studentData = studentSnapshot.docs[0].data();
                students.push({
                    name: studentData.name,
                    email: studentData.email,
                    branch: studentData.branch
                });
            }
        }

        return res.status(200).json(students);

    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(8080, () => {
    console.log('server is running on http://localhost:8080');
});