
let pagina = 1;
const cita = {
    nombre: '',
    fecha:'',
    hora:'',
    servicios: []

}

document.addEventListener('DOMContentLoaded',function(){
    iniciarApp();
}); 
function iniciarApp(){
    mostrarServicios();

    //Resalta el div actual segun el tab que se presiona 
    mostrarSeccion();

    //Oculta o muestra la seccion depende el tab que se presiona
    cambiarSeccion();

    //Paginacion Siguiente y Anterior
    paginaSiguiente();
    
    paginaAnterior();

    //COmprueba la pagina actual para ocultar o mostrar botones
    botonesPaginador();

    //Muestra el Resumen de la cita o mensaje de error en caso de no pasar la validacion
    mostrarResumen();

    //Almacena el nombre de la cita en el objeto
    nombreCita();
    //Almacena la fecha de la cita en el objeto
    fechaCita();

    //Desabilita dias pasados
    deshabilitarFechaAnterior();
    //Almacena la hora 
    horaCita();

}

function mostrarSeccion(){

    //Eliminar mostrar-seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    const seccionActual =  document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
    //Eliminar actual
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    //Resalta el tab actual 
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {   
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);   
            //Eliminar mostrar seccion de la seccion anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');  
            //Agrega Mostrar-Seccion donde dimos click
            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');
            //Eliminar clase de actual en el tab anterior
            document.querySelector('.tabs button.actual').classList.remove('actual');
            //Agrega clase de actual en el nuevo tab
           const tabActual = document.querySelector(`[data-paso="${pagina}"]`);
           tabActual.classList.add('actual');
           botonesPaginador();
        })
    })
 
}


async function mostrarServicios(){
    try{
        const resultado = await fetch('./servicios.json')
        const db = await resultado.json();
        const {servicios} = db;

        //Generar Html
        servicios.forEach(servicio => {
            const {id, nombre, precio} =  servicio;

            //DOM Scripting
            //Generar Nombre de Servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            //Generar Precio de Servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            
            //Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //Inyectar Precio y nombre al Div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectarlo html
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    }catch(error){
        console.log(error);
    }
}

function seleccionarServicio(e){

    let elemento;
    //Forzar que el elemento al que le demos click sea el id
    if(e.target.tagName === 'P'){
        elemento =  e.target.parentElement;
    }
    else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }
    else{
        elemento.classList.add('seleccionado');
        
        const servicioObjt = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio:elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarServicio(servicioObjt);
    }
}
function eliminarServicio(id){
    //const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

}
function agregarServicio(Objeto){
    const {servicios} = cita;
    cita.servicios = [...servicios,Objeto];
    console.log(cita);
}

function paginaSiguiente(){

    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();

    });
} 

function paginaAnterior(){

    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
   
    if(pagina==1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();//Estamos en la pagina 3 carga el resumen de la cita
    }
    else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion(); //Cambia la seccion que se muestra por la de la pagina

}

function mostrarResumen(){
    //Deestructuring
    const {nombre, fecha, hora, servicios} = cita;  
    //selector
    const resumenDiv = document.querySelector('.contenido-resumen');
    //Limpia el HTML previo
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);  
    }

    //validacion de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //Agregar a ResumenDiv
        resumenDiv.appendChild(noServicios);
        return;

    }
        //Mostrar el Resumen
     const headingCita = document.createElement('H3');
    headingCita.textContent = 'Datos de la Cita';
    
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serciviosCita = document.createElement('DIV');
    serciviosCita.classList.add('resumen-servicios');

     const headingServicios = document.createElement('H3');
     headingServicios.textContent = 'Resumen de Servicios';

     serciviosCita.appendChild(headingServicios);

     let cantidad = 0;
    //Iterar sobre el arreglo de servicios
    servicios.forEach(servicio =>{
        const {nombre,precio} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contendor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');
        
        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        //Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        serciviosCita.appendChild(contenedorServicio);

        const cantidadPagar = document.createElement('P');
        cantidad.classList.add('total');
        cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$ ${cantidad}`;
    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serciviosCita);
    resumenDiv.appendChild(cantidadPagar);

    

}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input',(e)=>{
        const nombreTexto = e.target.value.trim(); //Elimina espacio en blanco al inicio y al final
        //Validacion de que nombreTexto debe tener algo
        if(nombreTexto ==='' || nombreTexto.length < 3){
             mostrarAlerta('Nombre No Valido','error');
          }else{
              const alerta = document.querySelector('.alerta');
              if(alerta){
                  alerta.remove();
              }
              cita.nombre = nombreTexto;
          }
    });
}

function mostrarAlerta(mensaje, tipo){
    //si hay na alerta previa entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    if(tipo === 'error'){
        alerta.classList.add('error');
    }

    //Insertar en el html 
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar alerta ddespues de 3 segundos
    setTimeout(()=>{
        alerta.remove();
    },3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>{
        const dia = new Date(e.target.value).getUTCDay();
        if([0].includes(dia)){
            e.preventDefault();
            fechaInput.value ='';
            mostrarAlerta('Fines de Semana Estamos Cerrados','error');
        }
        else{
            cita.fecha = fechaInput.value;
        }
    });
}

function  deshabilitarFechaAnterior(){
    const inputFecha= document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDay() + 1;
    //Formato deseado year-monst-day
    const fechaDeshabilitar = `${year}-${mes}-${dia}`; 
    inputFecha.min = fechaDeshabilitar;
}
function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita= e.target.value;
        const hora = horaCita.split(':');
        if(hora[0]< 10 || hora[0]> 18)
        {
            mostrarAlerta('Hora No Valida', 'error');
            setTimeout(()=>{
                inputHora.value='';
            },3000);
        
        }
        else{
            cita.hora = horaCita;
        }
    });
}