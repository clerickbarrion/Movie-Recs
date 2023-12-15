const host = window.location.origin

const inputMovie = document.getElementById('input-movie')
const similarMovies = document.getElementById('similar-movies')
const leftButton = document.getElementById('scroll-left')
const rightButton = document.getElementById('scroll-right')

inputMovie.addEventListener('keydown', e=>{
    if (e.key === 'Enter'){
        similarMovies.innerHTML = ''
        fetch(`${host}/api/movie?search=${inputMovie.value}`).then(res =>res.json()).then(movies => {
            if (movies.error) {
                similarMovies.innerHTML = `<h1>${movies.error}</h1>`
            } else {
                movies.forEach(movie =>{
                    const li = document.createElement('li')
                    let imgPath = 'https://www.themoviedb.org/t/p/w440_and_h660_face/'
                    if (movie.poster_path == null){imgPath = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png'}
                    else {imgPath += movie.poster_path}
                    li.innerHTML = `
                    <figure>
                        <button>Add to list</button>
                        <figcaption><p>${movie.title}</p><p>${movie.vote_average}/10</p></figcaption>
                        <img src='${imgPath}' alt='movie poster'>
                        <p>${movie.overview}</p>
                    </figure>
                    `
                    li.querySelector('button').addEventListener('click', ()=>{
                        const data = {
                            imgPath: imgPath,
                            title: movie.title,
                            average: movie.vote_average,
                            user: localStorage.getItem('user')
                        }
                        fetch(`${host}/api/addMovie`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data)
                        })
                    })
                    similarMovies.appendChild(li)
                })
            }
        })
    }
})

rightButton.addEventListener('click',()=>{
    similarMovies.scrollLeft += window.innerWidth*0.70
})
leftButton.addEventListener('click',()=>{
    similarMovies.scrollLeft -= window.innerWidth*0.70
})