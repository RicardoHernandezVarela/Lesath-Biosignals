const nomCat = document.querySelector('.nomCat')
const close = document.querySelector('.cls')
const modal = document.querySelector('.mdl')

nomCat.addEventListener('click', e => {
    modal.style.display = 'block'
    console.log('a')
})

close.addEventListener('click', e => {
    modal.style.display = 'none'
})
