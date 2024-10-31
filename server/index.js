const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'librohub'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});





app.post('/agregar_libro', (req, res) => {
  const { titulo, autor, anio_publicacion, precio, stock, descripcion, id_categoria } = req.body;

  const sqlInsert = 'INSERT INTO Libros (titulo, autor, anio_publicacion, precio, stock, descripcion, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sqlInsert, [titulo, autor, anio_publicacion, precio, stock, descripcion, id_categoria], (err, result) => {
    if (err) {
      console.error('Error al insertar el libro:', err);
      return res.status(500).send('Error al insertar el libro');
    }
    res.send(result);
  });
});



app.get('/mostrar_libros_admin', (req, res) => {
  const sqlSelect = `
    SELECT * FROM libros
  `;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error('Error al obtener los libros:', err);
      return res.status(500).send('Error al obtener los libros');
    }
    res.json(result);
  });
});


app.get('/mostrar_libros_user', (req, res) => {
  const sqlSelect = `
    SELECT libros.titulo, libros.autor, libros.anio_publicacion, libros.precio, libros.stock, libros.descripcion , categorias.nombre_categoria 
    FROM libros 
    INNER JOIN categorias ON categorias.id_categoria = libros.id_categoria
  `;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error('Error al obtener los libros:', err);
      return res.status(500).send('Error al obtener los libros');
    }
    res.json(result);
  });
});



app.put('/actualizar_libro', (req, res) => {
    const { id_libro, titulo, autor, anio_publicacion, precio, stock, descripcion, id_categoria } = req.body;
  
    const sqlUpdate = 'UPDATE libros SET titulo=?, autor=?, anio_publicacion=?, precio=?, stock=?, descripcion=?, id_categoria=? WHERE id_libro=?';
    db.query(sqlUpdate, [titulo, autor, anio_publicacion, precio, stock, descripcion, id_categoria, id_libro], (err, result) => {
      if (err) {
        console.error('Error al actualizar el libro:', err);
        return res.status(500).send('Error al actualizar el libro');
      }
      res.send(result);
    });
});


app.delete('/eliminar_libro/:id_libro', (req, res) => {
  const id_libro = req.params.id_libro;

  const sqlDelete = 'DELETE FROM libros WHERE id_libro=?';

  db.query(sqlDelete, id_libro, (err, result) => {
    if (err) {
      console.error('Error al eliminar el libro:', err);
      return res.status(500).send('Error al eliminar el libro');
    }
    res.send(result);
  });
});


app.post('/agregar_usuario', (req, res) => {
  const { nombre, correo, contrasena, direccion, telefono } = req.body;

  const sqlInsert = 'INSERT INTO usuarios (nombre, correo, contrasena, direccion, telefono) VALUES (?, ?, ?, ?, ?)';
  db.query(sqlInsert, [nombre, correo, contrasena, direccion, telefono], (err, result) => {
    if (err) {
      console.error('Error al agregar el usuario:', err);
      return res.status(500).send('Error al agregar el usuario');
    }
    res.send(result);
  });
});


app.post('/login', (req, res) => {
  const { nombre, contrasena } = req.body;

  const sqlSelect = 'SELECT * FROM usuarios WHERE nombre= ? AND contrasena=?';
  db.query(sqlSelect, [nombre, contrasena], (err, result) => {
    if (err) {
      console.error('Error al obtener el usuario:', err);
      return res.status(500).send('Error al obtener el usuario');
    }

    if (result.length > 0) {
      const usuario = result[0].rol; 
      return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', rol: usuario }); 
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  });
});




app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});
