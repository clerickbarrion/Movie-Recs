const host = window.location.origin

const inputMovie = document.getElementById('input-movie')
const similarMovies = document.getElementById('similar-movies')
const leftButton = document.getElementById('scroll-left')
const rightButton = document.getElementById('scroll-right')

// gets similar movies when enter key pressed
inputMovie.addEventListener('keydown', e=>{
    if (e.key === 'Enter'){
        similarMovies.innerHTML = ''
        // get request to similar movie endpoint 
        fetch(`${host}/api/movie?search=${inputMovie.value}`).then(res =>res.json()).then(movies => {
            // shows error
            if (movies.error) {
                similarMovies.innerHTML = `<h1>${movies.error}</h1>`
            } else {
                // takes each movie writes its information with an ul
                movies.forEach(movie =>{
                    const li = document.createElement('li')
                    // img path template
                    let imgPath = 'https://www.themoviedb.org/t/p/w440_and_h660_face'
                    // 'img not found image' if no poster path
                    if (movie.poster_path == null){imgPath = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png'}
                    // appends path to template
                    else {imgPath += movie.poster_path}
                    // adds movie info to li
                    li.innerHTML = `
                    <figure>
                        <button>Add to list</button>
                        <figcaption><p>${movie.title}</p><p>${movie.vote_average}/10</p></figcaption>
                        <img src='${imgPath}' alt='movie poster'>
                        <p>${movie.overview}</p>
                    </figure>
                    `
                    // event listener to add to list button
                    li.querySelector('button').addEventListener('click', ()=>{
                        const data = {
                            imgPath: imgPath,
                            title: movie.title,
                            average: movie.vote_average,
                            user: localStorage.getItem('user')
                        }
                        // sends post request to add movie to database
                        fetch(`${host}/api/addMovie`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data)
                        })
                    })
                    // adds li to ul
                    similarMovies.appendChild(li)
                })
            }
        })
    }
})

// scroll left or right in carousel
rightButton.addEventListener('click',()=>{
    similarMovies.scrollLeft += window.innerWidth*0.70
})
leftButton.addEventListener('click',()=>{
    similarMovies.scrollLeft -= window.innerWidth*0.70
})