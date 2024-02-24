class Materia{
    constructor(nombre, calificacion){
        this.nombre = nombre;
        this.calificacion = calificacion;
    }
}

class Alumno{
    constructor(nombre, apellidos, edad){
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.materias = []; 
    }
    saveGrade(materiaNombre, calificacion){
        const materia = new Materia(materiaNombre, calificacion);
        this.materias.push(materia);
    }
}

// function Materia(nombre) {
//     this.nombre = nombre;
// }

function guardarAlumno(alumno) {
    let alumnosArray = JSON.parse(localStorage.getItem('alumnos')) || [];
    alumnosArray.push(alumno);
    localStorage.setItem('alumnos', JSON.stringify(alumnosArray));
}

function guardarMateria(materia) {
    let materias = JSON.parse(localStorage.getItem('materias')) || [];
    materias.push(materia);
    localStorage.setItem('materias', JSON.stringify(materias));
}

function obtenerAlumnos() {
    const alumnosGuardados = JSON.parse(localStorage.getItem('alumnos')) || [];
    return alumnosGuardados.map(alumno => {
        const { nombre, apellidos, edad, materias } = alumno;
        const nuevoAlumno = new Alumno(nombre, apellidos, edad);
        nuevoAlumno.materias = materias;
        return nuevoAlumno;
    });
}


function obtenerMaterias() {
    return JSON.parse(localStorage.getItem('materias')) || [];
}

function altaAlumno() {
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const edad = parseInt(document.getElementById('edad').value);

    const alumno = new Alumno(nombre, apellidos, edad);
    guardarAlumno(alumno);
    mostrarAlumnos();
}

function inscribirMateria() {
    const materiaNombre = document.getElementById('materiaNombre').value;
    const materia = new Materia(materiaNombre);
    guardarMateria(materia);
    mostrarMateriasCal();
}

function mostrarAlumnos() {
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

function mostrarMateriasCal() {
    const materias = obtenerMaterias();
    const selectMateriasCal = document.getElementById('materiasCal');
    selectMateriasCal.innerHTML = '';

    materias.forEach(materia => {
        const option = document.createElement('option');
        option.text = materia.nombre;
        option.value = materia.nombre;
        selectMateriasCal.appendChild(option);
    });
}

function calcularPromedioAlumno(alumno) {
    const calificaciones = alumno.calificaciones;
    if (calificaciones.length === 0) return 0;
    const sumaCalificaciones = calificaciones.reduce((total, calificacion) => total + calificacion, 0);
    return sumaCalificaciones / calificaciones.length;
}

function asignarCalificacion() {
    const alumnoSeleccionado = JSON.parse(document.getElementById('alumnosCal').value);
    const materiaSeleccionada = document.getElementById('materiasCal').value;
    const calificacion = parseFloat(document.getElementById('calificacion').value);
    const alumnosArray = obtenerAlumnos();
    const indiceAlumno = alumnosArray.findIndex(a => a.nombre === alumnoSeleccionado.nombre && a.apellidos === alumnoSeleccionado.apellidos && a.edad === alumnoSeleccionado.edad);
    console.log(indiceAlumno);

    if (indiceAlumno !== -1) {
        alumnosArray[indiceAlumno].saveGrade(materiaSeleccionada, calificacion);
        actualizarAlumno(alumnosArray);
        console.log(alumnosArray[indiceAlumno]);
    } else {
        alert("Error: No se pudo encontrar al alumno.");
    }
}

function obtenerIndiceAlumno(alumno) {
    
}

function actualizarAlumno(alumnosArray) {
    // const alumnosArray = obtenerAlumnos();
    // alumnosArray[indice] = alumno;
    localStorage.setItem('alumnos', JSON.stringify(alumnosArray));
}

function obtenerPromedioAlumnos() {
    const alumnos = obtenerAlumnos();
    const resultados = alumnos.map(alumno => {
        const promedio = calcularPromedioAlumno(alumno);
        return {
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            promedio: promedio.toFixed(2)
        };
    });
    mostrarPromedioAlumnos(resultados);
}

function mostrarPromedioAlumnos(resultados) {
    const resultadosDiv = document.getElementById('resultados');

    // Crear un div para la tabla
    const tablaDiv = document.createElement('div');

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

function ordenarAlumnosAscendente() {
    const alumnos = obtenerAlumnos();
    alumnos.sort((a, b) => {
        const nombreA = `${a.nombre} ${a.apellidos}`;
        const nombreB = `${b.nombre} ${b.apellidos}`;
        return nombreA.localeCompare(nombreB);
    });
    mostrarResultados(alumnos);
}

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
    localStorage.removeItem('materias');
    mostrarAlumnos();
    mostrarMateriasCal();
    //mostrarMateriasPromedio();
}

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

function obtenerMateriasPromedio() {
    const materias = obtenerMaterias();
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

mostrarAlumnos();
mostrarMateriasCal();
//mostrarMateriasPromedio();
