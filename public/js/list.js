const host = window.location.orgin
window.addEventListener('DOMContentLoaded', ()=>{
    const user = localStorage.getItem('user')
    const ul = document.getElementById('similar-movies')
    fetch(`${host}/api/getList/${user}`).then(res=>res.json()).then(obj => {
        obj.list.forEach(movie => {
            let li = document.createElement('li')
            li.innerHTML = `
                <figure>
                    <button>Remove<button>
                    <figcaption><p>${movie.title}</p><p>${movie.average}/10</p></figcaption>
                    <img src='${movie.imgPath}' alt='movie poster'>
                </figure>
            `
            li.querySelector('button').addEventListener('click',()=>{
                const data = {title: movie.title, user: user}
                fetch(`${host}/api/removeMovie`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                li.remove()
            })
            ul.appendChild(li)
        })
    })


    const similarMovies = document.getElementById('similar-movies')
    const leftButton = document.getElementById('scroll-left')
    const rightButton = document.getElementById('scroll-right')
    rightButton.addEventListener('click',()=>{
        similarMovies.scrollLeft += window.innerWidth*0.70
    })
    leftButton.addEventListener('click',()=>{
        similarMovies.scrollLeft -= window.innerWidth*0.70
    })
    
})