const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para procesar datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (para la interfaz sencilla)
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado exitosamente a MongoDB'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

const Usuario = require('./models/Usuario');

// 1. CREATE: Crear un usuario (POST)
app.post('/api/usuarios', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. READ: Obtener todos los usuarios (GET)
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. UPDATE: Actualizar un usuario por ID (PUT)
app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ mensaje: 'Usuario actualizado', usuario: usuarioActualizado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. DELETE: Eliminar un usuario por ID (DELETE)
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});