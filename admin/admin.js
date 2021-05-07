const URL = 'https://dtcmask.herokuapp.com/api';
let table = document.getElementById('dtcbody')
let ok =  `<svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
</svg>`;
let fail = `<svg xmlns="http://www.w3.org/2000/svg" class="icon c-c" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`
async function getdtcdata(){
    let i_data = await fetch(URL+'/dtcdata')
    let data = await i_data.json()
    let f_data = data.data
    var view = ""
    for(var i in f_data ){
       let date = new Date(f_data[i].dateTime)
       view += `<tr>
        <td data-label="Count">${i}</td>
        <td data-label="Date">${date.getDay().toString() +"-"+ date.getMonth().toString() +"-"+ date.getFullYear().toString()}</td>
        <td data-label="Time">${date.getHours().toString() +":"+ date.getMinutes().toString() +":"+ date.getSeconds().toString()}</td>
        <td data-label="Status">
           ${ f_data[i].state ? ok : fail }
        </td></tr>`;
    }
    table.innerHTML = view
}
   
getdtcdata()