const express = require("express");
const mysql = require("mysql");
const { promisify } = require("util");
const cors = require("cors");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testDb"
});

// Promisify the query function
const queryAsync = promisify(db.query).bind(db);

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database");
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});


//Addiing Record
app.post('/add', async (req, res) => {
    try {
        const { title, description, subject, frequency, rep, time } = req.body;

        const result = await queryAsync(
            `INSERT INTO scheduleTask (title, description, subject, frequency, rep, time) 
            VALUES (?, ?, ?, ?,?,?)`,
            [title, description, subject, frequency, rep, time]
        );
        console.log("Inserted:", result);
        res.status(201).json({
            message: result,
        });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});


//Fetching All record Data
app.get('/fetch', async (req, res) => {
    try {

        const result = await queryAsync(
            "SELECT * FROM scheduleTask"
        );

        if (result.length === 0) {
            return res.status(401).json({ message: 'There is NO Data in Task Table' });
        }

        console.log(result);
        res.status(200).json({ result});
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

//Delete record Data
app.delete('/delete', async (req, res) => {
    try {

        const {id} = req.body;
        // console.log(id);
        if (!id) {
            return res.status(404).json({ message: 'Task Id is required' });
        }

        const result = await queryAsync(
            "DELETE FROM scheduletask WHERE task_id =?",[id]
        );

        if (result.length === 0) {
            return res.status(401).json({ message: 'Selected Record ID is not found.' });
        }

        console.log(result);
        res.status(200).json({
            message: 'Selected Record is removed from table',
            Data: result
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

//Updating Record
app.put('/update/:id', async (req, res) => {
    try {
        console.log(req.params);
        const id = req.params.id //corrrectly retrieve the ID from params
        const updatedData = req.body;

        // Check if the ID is provided
        if (!id) {
            return res.status(400).json({ message: 'Record ID is required' });
        }

        // Check if the updated data is provided
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'Updated data is required' });
        }

        // Update the record in the database
        const result = await queryAsync(
            "UPDATE scheduletask SET ? WHERE task_id = ?", [updatedData, id]
        );

        // Check if the record was successfully updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Respond with success message
        res.status(200).json({
            message: 'Record updated successfully',
            data: updatedData
        });
    } catch (err) {
        console.error("Error during record update:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});



