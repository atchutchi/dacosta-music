const functions = require('firebase-functions');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Inicializar cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://oxplahazlmpcpkelpolv.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cGxhaGF6bG1wY3BrZWxwb2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNTA3MDAsImV4cCI6MjA0NjcyNjcwMH0.PpHCKJz4L34SFMJ8-xRLl2r0KdLbkqWZc5Hcl5N7LXo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// ========================
// ARTISTAS - ROTAS
// ========================

// GET /api/artists - Lista todos os artistas
app.get('/artists', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro ao buscar artistas:', error);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/artists - Criar novo artista
app.post('/artists', async (req, res) => {
  try {
    const data = req.body;

    const { data: artist, error } = await supabase
      .from('artists')
      .insert([data])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(artist);
  } catch (error) {
    console.error('Erro ao criar artista:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/artists/:slug - Buscar artista por slug
app.get('/artists/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro ao buscar artista:', error);
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/artists/:slug - Atualizar artista
app.put('/artists/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const data = req.body;

    const { data: artist, error } = await supabase
      .from('artists')
      .update(data)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(artist);
  } catch (error) {
    console.error('Erro ao atualizar artista:', error);
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/artists/:slug - Eliminar artista
app.delete('/artists/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('slug', slug);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Erro ao eliminar artista:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ========================
// EVENTOS - ROTAS
// ========================

// GET /api/events - Lista todos os eventos
app.get('/events', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/events - Criar novo evento
app.post('/events', async (req, res) => {
  try {
    const data = req.body;

    // Inserir evento
    const { data: event, error } = await supabase
      .from('events')
      .insert([data])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Se houver artistas associados
    if (data.artists && data.artists.length > 0 && event) {
      const eventArtists = data.artists.map((artistId) => ({
        event_id: event.id,
        artist_id: artistId,
      }));

      const { error: relationError } = await supabase
        .from('event_artists')
        .insert(eventArtists);

      if (relationError) {
        return res.status(500).json({ error: relationError.message });
      }
    }

    return res.json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/events/:id - Buscar evento por ID
app.get('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_artists (
          artists:artist_id (
            id,
            name,
            slug
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/events/:id - Atualizar evento
app.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Extrair artistas antes de atualizar o evento
    const { artists, ...eventData } = data;

    // Atualizar evento
    const { data: event, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Se houver artistas, atualizar relacionamentos
    if (artists && Array.isArray(artists)) {
      // Primeiro, remover relacionamentos existentes
      const { error: deleteError } = await supabase
        .from('event_artists')
        .delete()
        .eq('event_id', id);

      if (deleteError) {
        return res.status(500).json({ error: deleteError.message });
      }

      // Depois, inserir novos relacionamentos
      if (artists.length > 0) {
        const eventArtists = artists.map((artistId) => ({
          event_id: id,
          artist_id: artistId,
        }));

        const { error: insertError } = await supabase
          .from('event_artists')
          .insert(eventArtists);

        if (insertError) {
          return res.status(500).json({ error: insertError.message });
        }
      }
    }

    return res.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/events/:id - Eliminar evento
app.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Primeiro, remover relacionamentos
    const { error: relationError } = await supabase
      .from('event_artists')
      .delete()
      .eq('event_id', id);

    if (relationError) {
      return res.status(500).json({ error: relationError.message });
    }

    // Depois, remover o evento
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Erro ao eliminar evento:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ========================
// UPLOAD - ROTA
// ========================

// POST /api/upload - Upload de ficheiros
app.post('/upload', async (req, res) => {
  try {
    // Nota: Para uploads de ficheiros em Cloud Functions,
    // é necessário usar multer ou processo manual de multipart
    // Por enquanto, documentar que isto precisa de configuração especial
    return res.status(501).json({
      error: 'Upload handler deve ser implementado com multer e firebase-admin storage',
      code: 'NOT_IMPLEMENTED'
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return res.status(500).json({
      error: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Exportar como Cloud Function
exports.api = functions.https.onRequest(app);
