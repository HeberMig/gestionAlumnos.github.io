// PROTOTIPO ALUMNO
function Alumno(nombre, apellidos, edad){    
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.edad = edad;
    this.materias = [];
}

// METODOS DE ALUMNO

Alumno.prototype.guardarCalificacion = function(materiaNombre, calificacion){
    const result = this.validarMateria(materiaNombre);
    if (result !== -1) {
        this.materias[result].calificacion = calificacion;
    } else{
        console.log("El alumno no está inscrito a la materia ", materiaNombre);
    }
}

Alumno.prototype.inscribirMateria = function (materia) {
    const result = this.validarMateria(materia.nombre);
    console.log("Alumno validacion materia: ", result);// delete
    if (result == -1){
        this.materias.push(materia);
    } else{
        console.log("El alumno ya está inscrito a ", materia.nombre);
    }
}

Alumno.prototype.validarMateria = function (materiaNombre){
    return this.materias.findIndex(m => m.nombre === materiaNombre);
}

Alumno.prototype.calcularPromedio = function () {
    const materiasInscritas = this.materias;

    //contar las materias que sí tienen calificacion
    let contador = 0;

    // Variable que guardará la suma de todas las calificaciones del alumno.
    const SumaCalificaciones = materiasInscritas.reduce((acumulador, materia) =>{
        // condicion para solo sumar materias con calificacion
        if (materia.calificacion !== null) {
            contador++;
            return acumulador + materia.calificacion;
        } else {
            return acumulador;
        }
    }, 0)
    
    const promedio = SumaCalificaciones/contador;
    return promedio;
}

// PROTOTIPO MATERIA
function Materia(nombre){
    this.nombre = nombre;
    this.calificacion = null;
}

// PROTOTIPO CLASE
function Clase(nombre){
    this.nombre = nombre;
    this.alumnosInscritos = [];
}

// METODOS DE CLASE

//Función para agregar alumnos a una clase
Clase.prototype.agregarAlumno = function (nuevoAlumno) {
    //Si el alumno no existe en el array de alumnosInscritos de la clase, se agrega.
    const result = this.validarAlumno(nuevoAlumno);
    console.log("clase valida alumno: ", result); //delete
    if (result == -1) {
        this.alumnosInscritos.push(nuevoAlumno);        
    } else{
        console.log(`${nuevoAlumno.nombre} ya está inscrit@ a la clase de ${this.nombre}`);
    }
}

//Función para saber si el alumno existe o no en el array de alumnos inscritos
Clase.prototype.validarAlumno = function (alumno) {
    return this.alumnosInscritos.findIndex(a => a.nombre === alumno.nombre && a.apellidos === alumno.apellidos && a.edad === alumno.edad);
}


// SECCION ALTA DE ALUMNOS

function altaAlumno() {
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const edad = parseInt(document.getElementById('edad').value);

    const alumno = new Alumno(nombre, apellidos, edad);
    guardarAlumno(alumno);
    mostrarAlumnosInscripcion();
    mostrarAlumnosCal();
}

function guardarAlumno(alumno) {
    let alumnosArray = JSON.parse(localStorage.getItem('alumnos')) || [];
    alumnosArray.push(alumno);
    localStorage.setItem('alumnos', JSON.stringify(alumnosArray));
}


// SECCION CREAR CLASES

function crearClase() {
    const claseNombre = document.getElementById('materiaNombre').value;
    const clase = new Clase(claseNombre);
    guardarClase(clase);
    mostrarClasesInscripcion();
    mostrarClasesCal();
}

function guardarClase(clase) {
    let clasesArray = JSON.parse(localStorage.getItem('clases')) || [];
    clasesArray.push(clase);
    localStorage.setItem('clases', JSON.stringify(clasesArray));
}

// FUNCIONES PARA RECUPERAR ARRAYS ALUMNOS Y CLASES

function obtenerAlumnos() {
    const alumnosGuardados = JSON.parse(localStorage.getItem('alumnos')) || [];
    return alumnosGuardados.map(alumno => {
        const { nombre, apellidos, edad, materias } = alumno;
        const nuevoAlumno = new Alumno(nombre, apellidos, edad);
        nuevoAlumno.materias = materias;
        return nuevoAlumno;
    });
}

function obtenerClases() {
    const clasesGuardadas = JSON.parse(localStorage.getItem("clases")) || [];
    return clasesGuardadas.map(clase => {
        const {nombre, alumnosInscritos} = clase;
        const nuevaClase = new Clase(nombre);
        nuevaClase.alumnosInscritos = alumnosInscritos;
        return nuevaClase;
    })
}

// SECCION INSCRIBIR ALUMNO A UNA CLASE

function asignarClase() {
    const alumnoSeleccionado = JSON.parse(document.getElementById("alumnosInscripcion").value);
    const materiaSeleccionada = document.getElementById("materiasInscripcion").value;
    const nuevaMateria = new Materia(materiaSeleccionada);

    const alumnosArray = obtenerAlumnos();
    const clasesArray = obtenerClases();
    
    const indiceAlumno = obtenerIndiceAlumno(alumnosArray, alumnoSeleccionado);

    const indiceClase = clasesArray.findIndex(c => c.nombre === materiaSeleccionada);
    console.log(indiceClase);

    if (indiceAlumno!== -1 && indiceClase !== -1) {
        alumnosArray[indiceAlumno].inscribirMateria(nuevaMateria);
        clasesArray[indiceClase].agregarAlumno(alumnosArray[indiceAlumno]);
        actualizarAlumno(alumnosArray);
        actualizarClase(clasesArray);
        console.log(alumnosArray[indiceAlumno]);//delete
        console.log(clasesArray);//delete
    } else {
        alert("Error: No se pudo encontrar al alumno.");
    }
}

//Funcion para que se muestren los alumnos en el selector
function mostrarAlumnosInscripcion() {
    const alumnos = obtenerAlumnos();
    const selectAlumnosInscripcion = document.getElementById('alumnosInscripcion');
    selectAlumnosInscripcion.innerHTML = '';
    
    alumnos.forEach(alumno => {
        const option = document.createElement('option');
        option.text = `${alumno.nombre} ${alumno.apellidos}`;
        option.value = JSON.stringify(alumno);
        selectAlumnosInscripcion.appendChild(option);
    });
}

//Funcion para que se muestren las clases en el selector
function mostrarClasesInscripcion() {
    const clases = obtenerClases();
    const selectClasesInscripcion = document.getElementById('materiasInscripcion');
    selectClasesInscripcion.innerHTML = '';

    clases.forEach(clase => {
        const option = document.createElement('option');
        option.text = clase.nombre;
        option.value = clase.nombre;
        selectClasesInscripcion.appendChild(option);
    });
}


//SECCION ASIGNAR CALIFICACIONES

function asignarCalificacion() {
    const alumnoSeleccionado = JSON.parse(document.getElementById('alumnosCal').value);
    const materiaSeleccionada = document.getElementById('materiasCal').value;
    const calificacion = parseFloat(document.getElementById('calificacion').value);

    const alumnosArray = obtenerAlumnos();

    const indiceAlumno = obtenerIndiceAlumno(alumnosArray, alumnoSeleccionado);

    if (indiceAlumno !== -1 && calificacion >= 0) {
        alumnosArray[indiceAlumno].guardarCalificacion(materiaSeleccionada, calificacion);
        actualizarAlumno(alumnosArray);
        console.log(alumnosArray[indiceAlumno]);
    } else if (indiceAlumno == -1) {
        alert("Error: No se pudo encontrar al alumno.");
    } else {
        console.log("La calificación no puede ser menor a 0");
    }
}

//Funcion para que se muestren los alumnos en los selectores
function mostrarAlumnosCal() {
    const alumnos = obtenerAlumnos();
    const selectAlumnosCal = document.getElementById('alumnosCal');
    selectAlumnosCal.innerHTML = '';
    
    alumnos.forEach(alumno => {
        const option = document.createElement('option');
        option.text = `${alumno.nombre} ${alumno.apellidos}`;
        option.value = JSON.stringify(alumno);
        selectAlumnosCal.appendChild(option);
    });
    
    //mostrarMateriasPromedio();
}

//Funcion para que se muestren las clases en los selectores
function mostrarClasesCal() {
    const materias = obtenerClases();
    const selectMateriasCal = document.getElementById('materiasCal');
    selectMateriasCal.innerHTML = '';

    materias.forEach(materia => {
        const option = document.createElement('option');
        option.text = materia.nombre;
        option.value = materia.nombre;
        selectMateriasCal.appendChild(option);
    });
}

//FUNCIONES AUXILIARES

function obtenerIndiceAlumno(alumnosArray, alumnoSeleccionado) {
    return alumnosArray.findIndex(a => a.nombre === alumnoSeleccionado.nombre && a.apellidos === alumnoSeleccionado.apellidos && a.edad === alumnoSeleccionado.edad);    
}

function actualizarAlumno(alumnosArray) {
    localStorage.setItem('alumnos', JSON.stringify(alumnosArray));
}

function actualizarClase(clasesArray) {
    localStorage.setItem('clases', JSON.stringify(clasesArray));
}

//SECCION RESULTADOS

function buscarPorNombreApellido() {
    const query = prompt("Ingrese el nombre o apellido del alumno a buscar:");
    const alumnos = obtenerAlumnos();
    const resultados = alumnos.filter(alumno => {
        const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`;
        return nombreCompleto.toLowerCase().includes(query.toLowerCase());
    });
    mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
    const busquedaDiv = document.getElementById('busqueda');
    busquedaDiv.innerHTML = '';

    if (resultados.length === 0) {
        busquedaDiv.innerText = 'No se encontraron resultados.';
    } else {
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Edad</th>
            </tr>
        `;
        resultados.forEach(alumno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${alumno.nombre}</td>
                <td>${alumno.apellidos}</td>
                <td>${alumno.edad}</td>
            `;
            table.appendChild(row);
        });
        busquedaDiv.appendChild(table);
    }
}

// Devuelve un array con los promedios de todos los alumnos con calificacion
function obtenerPromedioAlumnos() {
    const alumnos = obtenerAlumnos();
    const resultados = alumnos.map(alumno => {
        const promedio = alumno.calcularPromedio();
        if (!isNaN(promedio)) {
            return {
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            promedio: promedio.toFixed(2)
            };
        }
    }).filter(Boolean);//eliminar del array resultados a los elementos alumnos cuyo promedio es NaN
    mostrarPromedioAlumnos(resultados);
}

function mostrarPromedioAlumnos(resultados) {
    const resultadosDiv = document.getElementById('resultados');
    
    // eliminar tablas previas
    let tablaDivElement = document.getElementById("tablaDiv");
    if (tablaDivElement !== null) {
        tablaDivElement.remove();
    }
    // Crear un div para la tabla
    const tablaDiv = document.createElement('div');
    tablaDiv.setAttribute("id", "tablaDiv");

    // Crear la tabla
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Promedio</th>
        </tr>
    `;
    resultados.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alumno.nombre}</td>
            <td>${alumno.apellidos}</td>
            <td>${alumno.promedio}</td>
        `;
        table.appendChild(row);
    });

    // Agregar la tabla al div
    tablaDiv.appendChild(table);

    // Agregar el div con la tabla al final del div "resultados"
    resultadosDiv.appendChild(tablaDiv);
}

//Ordena alumnos por nombre
function ordenarAlumnosAscendente() {
    const alumnos = obtenerAlumnos();
    alumnos.sort((a, b) => {
        const nombreA = `${a.nombre} ${a.apellidos}`;
        const nombreB = `${b.nombre} ${b.apellidos}`;
        return nombreA.localeCompare(nombreB);
    });
    mostrarResultados(alumnos);
}

//Ordena alumnos por nombre
function ordenarAlumnosDescendente() {
    const alumnos = obtenerAlumnos();
    alumnos.sort((a, b) => {
        const nombreA = `${a.nombre} ${a.apellidos}`;
        const nombreB = `${b.nombre} ${b.apellidos}`;
        return nombreB.localeCompare(nombreA);
    });
    mostrarResultados(alumnos);
}

function borrarDatos() {
    localStorage.removeItem('alumnos');
    localStorage.removeItem('clases');
    mostrarAlumnosInscripcion();
    mostrarClasesInscripcion();
    mostrarAlumnosCal();
    mostrarClasesCal();
    //mostrarMateriasPromedio();
}

// Estas dos funciones no se están llamando en el documento, tampoco se ha comprobado funcionalidad
// si sirven para desarrollar otras funcionalidades o apoyar en tu trabajo, úsenlas, adáptenlas y/o elimínenlas
function obtenerClasesPromedio() {
    const materias = obtenerClases();
    const selectMateriasPromedio = document.getElementById('materiasPromedio');
    selectMateriasPromedio.innerHTML = '';

    materias.forEach(materia => {
        const option = document.createElement('option');
        option.text = materia.nombre;
        option.value = materia.nombre;
        selectMateriasPromedio.appendChild(option);
    });
}
function obtenerPromedioMateria() {
    const materiaSeleccionada = document.getElementById('materiasPromedio').value;
    const alumnos = obtenerAlumnos();
    const calificacionesMateria = alumnos.flatMap(alumno => {
        const index = alumno.materias.indexOf(materiaSeleccionada);
        return index !== -1 ? [alumno.calificaciones[index]] : [];
    });
    if (calificacionesMateria.length === 0) {
        alert("No hay calificaciones registradas para esta materia.");
    } else {
        const promedio = calificacionesMateria.reduce((a, b) => a + b, 0) / calificacionesMateria.length;
        alert(`El promedio de la materia ${materiaSeleccionada} es: ${promedio.toFixed(2)}`);
    }
}

//Se llaman a estas funciones para que cuando se recargue la página o se guarden cambios, los datos en los selectors del html se sigan mostrando

mostrarAlumnosInscripcion();
mostrarClasesInscripcion();
mostrarAlumnosCal();
mostrarClasesCal();

//mostrarMateriasPromedio();
