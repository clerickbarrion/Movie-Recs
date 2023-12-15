const fetch = require('node-fetch');
const path = require('path')
const express = require('express')
const mysql = require('mysql')
const app = express()

const con = mysql.createPool({connectionLimit:40,host:"sql5.freemysqlhosting.net",user:"sql5670441",password:"pADXp2Z7sn", database: "sql5670441",debug: false})

const port = 3000

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGU5NmFhZmRiOGIwNWJkNGMwMzkyNDM3ZTEzNGJjNyIsInN1YiI6IjY1NzcyZWE1NTY0ZWM3MDBhY2Q0ZDFmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fjvHhYWM0hzn830zTKHtyuru8HLOqQyuXlntPsVrUQw'
  }
};

async function getMovieId(movie){
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURI(movie)}&include_adult=false&language=en-US&page=1`
    return fetch(url,options).then(res=>res.json()).then(json=>json.results[0].id)
}

async function getSimilarMovies(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    return fetch(url,options).then(res=>res.json()).then(json=>json.results)
}

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/movie', async (req,res)=>{
    res.writeHead(200, {"Content-Type": "application/json"})
    try{
        const id = await getMovieId(req.query.search)
        const movies = await getSimilarMovies(id)
        res.write(JSON.stringify(movies))
    } catch {
        res.write(JSON.stringify({error: 'Movie does not exist'}))
    }
    res.end()
})

app.post('/api/addMovie', (req,res)=>{
    res.status(200)
    con.getConnection( (err,connection) =>{
        if (err) throw err; console.log("sql connected!")
        let sql = `INSERT INTO userList (imgPath, title, average, user) VALUES ("${req.body.imgPath}","${req.body.title}","${req.body.average}","${req.body.user}")`
        connection.query(sql, (err,result)=>{
            if (err) throw err;
            connection.release()
        })
    })
    res.end()
})

app.get('/api/getList/:user', async (req,res)=>{
    res.writeHead(200, {"Content-Type": "application/json"})
    function getList(){
        return new Promise((resolve,reject)=>{
            con.getConnection( (err,connection) =>{
                if (err) throw err; console.log("sql connected!")
                let sql = `SELECT * FROM userList WHERE user = "${req.params.user}"`
                connection.query(sql, (err,result)=>{
                    if (err) throw err;
                    resolve(result)
                    connection.release()
                })
            })
        })
    }
    const list = await getList()
    res.write(JSON.stringify({list: list}))
    res.end()
})

app.delete('/api/removeMovie', (req,res)=>{
    res.status(200)
    con.getConnection( (err,connection) =>{
        if (err) throw err; console.log("sql connected!")
        let sql = `DELETE FROM userList WHERE title = "${req.body.title}" AND user = "${req.body.user}"`
        connection.query(sql, (err,result)=>{
            if (err) throw err;
            connection.release()
        })
    })
    res.end()
})

app.post('/api/signUp', async (req,res)=>{
    res.status(200)
    function getResult(){
        return new Promise((resolve,reject)=>{
            con.getConnection( (err,connection) =>{
                if (err) throw err; console.log("sql connected!")
                let sql = `SELECT user FROM users WHERE user = "${req.body.user.toUpperCase()}"`
                connection.query(sql, (err, result)=>{
                    if (err) throw err
                    if (result.length) resolve({error: "Username already taken"})
                    else {
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
    res.write(JSON.stringify({result: result}))
    res.end()
})

app.get('/api/login', async (req,res)=>{
    res.status(200)
    function getResult(){
        return new Promise((resolve,reject)=>{
            con.getConnection( (err,connection) =>{
                if (err) throw err; console.log("sql connected!")
                let sql = `SELECT user FROM users WHERE user = "${req.query.user}" AND password = "${req.query.password}"`
                connection.query(sql, (err, result)=>{
                    if (err) throw err
                    if (!result.length) resolve({error: "Invalid username/password"})
                    else {
                        resolve({result: result})
                    }
                })
                connection.release()
            })
        })
    }
    const result = await getResult()
    res.write(JSON.stringify({result: result}))
    res.end()
})

app.listen(port)