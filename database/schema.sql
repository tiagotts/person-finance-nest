-- Criação do schema
CREATE SCHEMA IF NOT EXISTS personfinance;

-- Configurar o schema padrão
SET search_path TO personfinance;

-- Criação da tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de cartões
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    number VARCHAR(255) NOT NULL,
    expiration_date DATE NOT NULL,
    closing_day INTEGER NOT NULL,
    due_day INTEGER NOT NULL,
    "limit" DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de categorias
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de closure para hierarquia de categorias
CREATE TABLE category_closure (
    id_ancestor UUID NOT NULL REFERENCES categories(id),
    id_descendant UUID NOT NULL REFERENCES categories(id),
    depth INTEGER NOT NULL,
    PRIMARY KEY (id_ancestor, id_descendant)
);

-- Criação da tabela de transações
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    installments INTEGER NOT NULL,
    current_installment INTEGER,
    card_id UUID NOT NULL REFERENCES cards(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação do enum para tipos de importação
CREATE TYPE import_type AS ENUM ('OFX', 'CSV');

-- Criação da tabela de arquivos importados
CREATE TABLE import_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    type import_type DEFAULT 'OFX',
    metadata JSONB,
    total_transactions INTEGER NOT NULL,
    imported_transactions INTEGER NOT NULL,
    processed BOOLEAN DEFAULT false,
    card_id UUID NOT NULL REFERENCES cards(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação dos índices
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_card_id ON transactions(card_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_import_files_card_id ON import_files(card_id);
CREATE INDEX idx_category_closure_ancestor ON category_closure(id_ancestor);
CREATE INDEX idx_category_closure_descendant ON category_closure(id_descendant);