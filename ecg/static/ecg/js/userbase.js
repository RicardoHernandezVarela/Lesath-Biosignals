const modalTrigger = document.querySelector('.add')
const close = document.querySelector('.close')
const modal = document.querySelector('.modal')

const signalCat = document.querySelectorAll('.signalCat');

modalTrigger.addEventListener('click', (evt) => {
    modal.style.display = 'block';
});

close.addEventListener('click', (evt) => {
    modal.style.display = 'none';
});

const getURL = (path, change) => {
    let oldPath = path;
    let splitPath = oldPath.split('/');
    splitPath[splitPath.length - 3] = change;

    let newPath = splitPath.join('/');

    return newPath;
}

signalCat.forEach( item => {
    console.log(item.parentNode.href);
    
    switch(item.innerText) {
        case 'Electrocardiograma':
            item.parentNode.parentNode.style.background = '#d50000';
            break;
        case 'Electromiograma':
            item.parentNode.parentNode.style.background = '#0288d1';
            item.parentNode.href = getURL(item.parentNode.href, 'emg');
             break;
        case 'Fonocardiograma':
            item.parentNode.parentNode.style.background = '#00695c';
            item.parentNode.href = getURL(item.parentNode.href, 'fcg');
            break;
        case 'Electrodérmica':
            item.parentNode.parentNode.style.background = '#ffb300';
            item.parentNode.href = getURL(item.parentNode.href, 'edm');
            break;
        case 'Oximetría':
            item.parentNode.parentNode.style.background = '#fb8c00';
            break;
        default:
            item.parentNode.parentNode.style.background = '#eeff41';
      }

      console.log(item.parentNode.href);

});