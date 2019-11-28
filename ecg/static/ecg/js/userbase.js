const nomCat = document.querySelector('.add')
const close = document.querySelector('.close')
const modal = document.querySelector('.modal')

nomCat.addEventListener('click', (evt) => {
    modal.style.display = 'block';
});

close.addEventListener('click', (evt) => {
    modal.style.display = 'none';
});

