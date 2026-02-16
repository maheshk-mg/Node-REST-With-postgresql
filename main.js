import connection from "./config/db.js";
import express from "express";

const PORT = 3000;

const app = express();
app.use(express.json());

//================================== User API Endpoints ============================
app.get("/getUsers", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const offset = (page - 1) * limit;
  const selectQuery =
    "SELECT * from users ORDER BY user_id ASC LIMIT $1 OFFSET $2";
  const countQuery = `SELECT COUNT(*) FROM users`;

  try {
    const result = await connection.query(selectQuery, [limit, offset]);
    const countResult = await connection.query(countQuery);
    const totalRecords = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    console.log("Data retrieved successfully", result);

    res.status(200).json({
      page,
      limit,
      totalRecords,
      totalPages,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error getting data", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getUser/:id", async (req, res) => {
  const { id } = req.params;
  const selectQuery = "SELECT * from users where user_id = $1";

  try {
    const result = await connection.query(selectQuery, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Data retrieved successfully", result);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error getting data", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addUser", async (req, res) => {
  const { name, email } = req.body;
  const insertQuery = "INSERT INTO users (name, email) VALUES ($1, $2)";

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email required" });
  }

  try {
    const result = await connection.query(insertQuery, [name, email]);
    console.log("Data inserted successfully", result);
    res.status(201).json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error("Error inserting data", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/updateUser/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const updateQuery =
    "UPDATE users SET name = $1, email = $2 WHERE user_id = $3";

  try {
    const result = await connection.query(updateQuery, [name, email, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Data updated successfully", result);
    res.status(200).json({ message: "Data updated successfully" });
  } catch (err) {
    console.error("Error updating data", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  const deleteQuery = "DELETE FROM users WHERE user_id = $1";
  try {
    const result = await connection.query(deleteQuery, [id]);
    console.log("Data deleted successfully", result);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting data", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//============================ TASK API Endpoints ============================
app.get("/getTasks", async (req, res) => {
  const selectQuery = "SELECT * from tasks";

  try {
    const result = await connection.query(selectQuery);
    console.log("Task retrieved successfully", result);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error getting task", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getTasks/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const selectQuery = "SELECT * from tasks where user_id = $1";

  try {
    const result = await connection.query(selectQuery, [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    console.log("Task retrieved successfully", result);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error getting task", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addTask", async (req, res) => {  
  const { title, description, status, user_id } = req.body;
  const insertQuery =
    "INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4)";
  

  if (!title || !description || !user_id) {
    return res
      .status(400)
      .json({ error: "Title, description and user_id required" });
  }

    // Validate status if provided
  const validStatuses = ['pending', 'in_progress', 'completed'];
  const taskStatus = status || 'pending';
  
  if (!validStatuses.includes(taskStatus)) {
    return res.status(400).json({ 
      error: `Status must be one of: ${validStatuses.join(', ')}` 
    });
  }


  try {
    const result = await connection.query(insertQuery, [
      title,
      description,
      taskStatus,
      user_id,
    ]);
    console.log("Task inserted successfully", result);
    res.status(201).json({ message: "Task inserted successfully" });
  } catch (err) {
    console.error("Error inserting task", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/updateTask/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const updateQuery =
    "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE task_id = $4";   
    
    

})
 






//=============================DB Connection==============================
connection
  .connect()
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });

// app.get('/getdata', async (req, res) => {
//     const selectQuery = 'SELECT * FROM demo_table';

//     try {
//         connection.query(selectQuery, (err, result) => {
//             if (err) {
//                 res.send(err)
//             }else{
//                 console.log('Data retrieved successfully',result);
//                 res.status(200).json(result.rows);
//             }

//         })
//     } catch (err) {
//         console.error('Error retrieving data', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/postdata', async (req, res) => {
//     const { name } = req.body;
//     const instertQuery = 'INSERT INTO demo_table (name, id) VALUES ($1, $2)';

//     try {
//         connection.query(instertQuery, [name,id],(err, result) => {
//             if (err) {
//                 res.send(err)
//             }else{
//                 console.log('Data inserted successfully',result);
//                 res.status(201).json({ message: 'Data inserted successfully' });
//             }

//         })
//     }
//     catch (err) {
//         console.error('Error inserting data', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }

// });

// app.delete('/deletedata/:id', async (req, res) => {
//     const { id } = req.params;
//     const deleteQuery = 'DELETE FROM demo_table WHERE id = $1';
//     try {
//         connection.query(deleteQuery, [id], (err, result) => {
//             if (err) {
//                 res.send(err)
//             }else{
//                 console.log('Data deleted successfully',result);
//                 res.status(200).json({ message: 'Data deleted successfully' });
//             }

//         })
//     }
//     catch (err) {
//         console.error('Error deleting data', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }

// });
