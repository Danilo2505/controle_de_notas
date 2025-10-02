-- --- Tabela bimestre ---
CREATE TABLE IF NOT EXISTS bimestre (
    id_bimestre INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

-- --- Tabela disciplinas ---
CREATE TABLE IF NOT EXISTS disciplinas (
    id_disciplina INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

-- --- Tabela salas ---
CREATE TABLE IF NOT EXISTS salas (
    id_sala INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

-- --- Tabela alunos ---
CREATE TABLE IF NOT EXISTS alunos (
    id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data_nascimento TEXT,
    id_sala INTEGER,
    FOREIGN KEY (id_sala) REFERENCES salas(id_sala) ON DELETE SET NULL
);

-- --- Tabela notas ---
CREATE TABLE IF NOT EXISTS notas (
    id_nota INTEGER PRIMARY KEY AUTOINCREMENT,
    id_aluno INTEGER NOT NULL,
    id_disciplina INTEGER NOT NULL,
    valor REAL NOT NULL,
    id_bimestre INTEGER NOT NULL,
    FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE,
    FOREIGN KEY (id_bimestre) REFERENCES bimestre(id_bimestre) ON DELETE CASCADE
);
        