const btnLigar = document.querySelector('#btnLigar');
const btnPausar = document.querySelector('#btnPausar');
const btnResetar = document.querySelector('#btnResetar');

const cronometro = document.querySelector('#cronometro');

let decSeg = 0;
let contando;  
let idContagem;

function mostraCronometro() {
    decSeg++;                          

    let ms = decSeg % 10;               
    let seg = Math.floor(decSeg / 10);  
    let min = Math.floor(seg / 60);     
    let hora = Math.floor(min / 60);    

    
    let strDecSeg = ms;
    let strHora = (hora < 10) ? '0' + hora : hora;
    let strMin = (min < 10) ? '0' + min : min;
    let strSeg = (seg < 10) ? '0' + seg : seg;

    
    cronometro.innerHTML = `${strHora}:${strMin}:${strSeg}.${strDecSeg}`;
}


btnLigar.addEventListener('click', () => {
    if(contando===true){return;}   
    idContagem = setInterval(mostraCronometro, 100);
    contando = true;
});

btnPausar.addEventListener('click', () => {
    if(contando===true){
        clearInterval(idContagem);                              
        contando = false;                                   
    }else if(contando===false){
        idContagem = setInterval(mostraCronometro, 100);         
        contando = true;                                    
    }else{
        return;
    }
});

btnResetar.addEventListener('click', () => {
    clearInterval(idContagem);                  
    cronometro.innerHTML = '00:00:00.0';        
    decSeg = 0;                                 
    contando = false;                           
});