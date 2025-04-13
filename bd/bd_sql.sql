    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE clients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE lawyers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        specialty VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        hourly_rate DECIMAL(10, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE cases (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID NOT NULL,
        lawyer_id UUID NOT NULL,
        case_title VARCHAR(255) NOT NULL,
        case_description TEXT,
        case_status VARCHAR(50) DEFAULT 'Abierto', -- Abierto, En Proceso, Cerrado.
        opened_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        closed_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE RESTRICT,
        FOREIGN KEY (lawyer_id) REFERENCES lawyers (id) ON DELETE RESTRICT
    );

    CREATE TABLE receipts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID NOT NULL,
        lawyer_id UUID NOT NULL,
        case_id UUID,
        amount DECIMAL(10, 2) NOT NULL,
        concept TEXT NOT NULL,
        payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        payment_method VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE RESTRICT,
        FOREIGN KEY (lawyer_id) REFERENCES lawyers (id) ON DELETE RESTRICT,
        FOREIGN KEY (case_id) REFERENCES cases (id) ON DELETE SET NULL
    );

    CREATE TABLE invoices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        receipt_id UUID NOT NULL,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        issue_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP WITH TIME ZONE,
        tax_amount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Emitida', -- Emitida, Pagada, Vencida, etc.
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (receipt_id) REFERENCES receipts (id) ON DELETE RESTRICT
    );

    ALTER TABLE cases ADD COLUMN document_with_weights tsvector;

    CREATE INDEX idx_fts_case ON cases USING GIN(document_with_weights);

    CREATE FUNCTION cases_tsvector_trigger() RETURNS trigger AS $$
    BEGIN
    NEW.document_with_weights :=
        setweight(to_tsvector('spanish', coalesce(case_title, '')), 'A') ||
        setweight(to_tsvector('spanish', coalesce(case_description, '')), 'B');
    RETURN NEW;
    END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON cases FOR EACH ROW EXECUTE FUNCTION cases_tsvector_trigger();


    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_clients_modtime
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

    CREATE TRIGGER update_lawyers_modtime
    BEFORE UPDATE ON lawyers
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

    CREATE TRIGGER update_cases_modtime
    BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

    CREATE TRIGGER update_receipts_modtime
    BEFORE UPDATE ON receipts
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

    CREATE TRIGGER update_invoices_modtime
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

    CREATE INDEX idx_cases_client_id ON cases(client_id);
    CREATE INDEX idx_cases_lawyer_id ON cases(lawyer_id);
    CREATE INDEX idx_receipts_client_id ON receipts(client_id);
    CREATE INDEX idx_receipts_lawyer_id ON receipts(lawyer_id);
    CREATE INDEX idx_receipts_case_id ON receipts(case_id);
    CREATE INDEX idx_invoices_receipt_id ON invoices(receipt_id);
