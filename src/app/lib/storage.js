export function saveToStorage(name,element){
    localStorage.setItem(name, JSON.stringify(element));
}

export function getFromStorage(name){
    return JSON.parse(localStorage.getItem(name));
}