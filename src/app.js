const fetch = require('node-fetch');
const path = require('path')
const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
// creates pools of connections
const con = mysql.createPool({connectionLimit:40,host:"sql5.freemysqlhosting.net",user:"sql5670441",password:"pADXp2Z7sn", database: "sql5670441",debug: false})

// joins src and public paths
app.use(express.static(path.join(__dirname, '../public')))
// receives requests as json
app.use(express.json())

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGU5NmFhZmRiOGIwNWJkNGMwMzkyNDM3ZTEzNGJjNyIsInN1YiI6IjY1NzcyZWE1NTY0ZWM3MDBhY2Q0ZDFmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fjvHhYWM0hzn830zTKHtyuru8HLOqQyuXlntPsVrUQw'
  }
};

// uses search movie api to get movie id
async function getMovie(movie){
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURI(movie)}&include_adult=false&language=en-US&page=1`
    return fetch(url,options).then(res=>res.json()).then(json=>json.results[0])
}

// uses similar movies api to get similar movies
async function getSimilarMovies(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    return fetch(url,options).then(res=>res.json()).then(json=>json.results)
}

// endpoint receives movie query 
app.get('/api/movie', async (req,res)=>{
    try{
        // gets id from query
        const movie = await getMovie(req.query.search)
        // uses id to use similar movies api
        const movies = await getSimilarMovies(movie.id)
        // writes it
        res.write(JSON.stringify({movie: movie,similar:movies}))
    } catch {
        res.write(JSON.stringify({error: 'Movie does not exist'}))
    }
    res.end()
})

// endpoint receives data and does an insert query with it
app.post('/api/addMovie', (req,res)=>{
    // connects to mysql database
    con.getConnection( (err,connection) =>{
        if (err) throw err
        // insert query
        let sql = `INSERT INTO userList (imgPath, title, average, user) VALUES ("${req.body.imgPath}","${req.body.title}","${req.body.average}","${req.body.user}")`
        connection.query(sql, (err,result)=>{
            if (err) throw err;
            // releases connection when done
            connection.release()
        })
    })
    res.end()
})

// endpoint takes user param to get their list from the database
app.get('/api/getList/:user', async (req,res)=>{
    function getList(){
        // returns promise to retrieve result
        return new Promise((resolve,reject)=>{
            con.getConnection( (err,connection) =>{
                if (err) throw err
                // select query to get movie details belonging to the user
                let sql = `SELECT * FROM userList WHERE user = "${req.params.user}"`
                connection.query(sql, (err,result)=>{
                    if (err) throw err;
                    // returns result
                    resolve(result)
                    connection.release()
                })
            })
        })
    }
    const list = await getList()
    //writes list
    res.write(JSON.stringify({list: list}))
    res.end()
})

// endpoint retrieves title and user and deletes item with those criteria
app.delete('/api/removeMovie', (req,res)=>{
    con.getConnection( (err,connection) =>{
        if (err) throw err
        // delete query to database where title and user are the same
        let sql = `DELETE FROM userList WHERE title = "${req.body.title}" AND user = "${req.body.user}"`
        connection.query(sql, (err,result)=>{
            if (err) throw err;
            connection.release()
        })
    })
    res.end()
})

// endpoint retrieves user info and adds it to user database if it doesnt already exist
app.post('/api/signUp', async (req,res)=>{
    function getResult(){
        return new Promise((resolve,reject)=>{
            con.getConnection( (err,connection) =>{
                if (err) throw err
                // select query to check if username already exists in database
                let sql = `SELECT user FROM users WHERE user = "${req.body.user}"`
                connection.query(sql, (err, result)=>{
                    if (err) throw err
                    if (result.length) resolve({error: "Username already taken"})
                    else {
                        // if it doesnt exist it enters user and password into database
                        sql = `INSERT INTO users (user, password) VALUES ("${req.body.user}","${req.body.password}")`
                        connection.query(sql, (err,result)=>{
                            if (err) throw err;
                            resolve({result: 'Success'})
                        })
                    }
                })
                connection.release()
            })
        })
    }
    const result = await getResult()
    // writes to show if error or success
    res.write(JSON.stringify({result: result}))
    res.end()
})

// endpoint receives user and password
app.get('/api/login', async (req,res)=>{
    function getResult(){
        return new Promise((resolve,reject)=>{
            con.getConnection( (err,connection) =>{
                if (err) throw err
                // select query to see if user and password match
                let sql = `SELECT user FROM users WHERE user = "${req.query.user}" AND password = "${req.query.password}"`
                connection.query(sql, (err, result)=>{
                    if (err) throw err
                    // if none show up one of them is invalid and error is returned
                    if (!result.length) resolve({error: "Invalid username/password"})
                    else {
                        // returns success
                        resolve({result: result})
                    }
                })
                connection.release()
            })
        })
    }
    const result = await getResult()
    // writes success or error
    res.write(JSON.stringify({result: result}))
    res.end()
})

app.listen(port)