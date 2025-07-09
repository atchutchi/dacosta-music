-- Criar tabela de eventos se não existir
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255) NOT NULL,
  venue VARCHAR(255),
  ticket_url TEXT,
  image_url TEXT,
  video_url TEXT,
  description TEXT,
  capacity INTEGER,
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);

-- Criar tabela de relacionamento entre eventos e artistas
CREATE TABLE IF NOT EXISTS event_artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID,
  artist_name VARCHAR(255), -- fallback caso não use tabela de artistas
  performance_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Criar índices para a tabela de relacionamento
CREATE INDEX IF NOT EXISTS idx_event_artists_event_id ON event_artists(event_id);
CREATE INDEX IF NOT EXISTS idx_event_artists_artist_id ON event_artists(artist_id);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artists ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública de eventos
CREATE POLICY "Eventos são publicamente visíveis" ON events
    FOR SELECT USING (true);

-- Política para leitura pública de artistas do evento
CREATE POLICY "Artistas dos eventos são publicamente visíveis" ON event_artists
    FOR SELECT USING (true);

-- Políticas para administradores (você precisará ajustar com base no seu sistema de autenticação)
-- Por enquanto, vamos criar políticas básicas que você pode ajustar depois
CREATE POLICY "Admins podem inserir eventos" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins podem atualizar eventos" ON events
    FOR UPDATE WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins podem deletar eventos" ON events
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem inserir artistas em eventos" ON event_artists
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins podem atualizar artistas em eventos" ON event_artists
    FOR UPDATE WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins podem deletar artistas de eventos" ON event_artists
    FOR DELETE USING (auth.role() = 'authenticated'); 