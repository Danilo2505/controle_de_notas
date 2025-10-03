from flask import Flask, render_template, g, jsonify, request, redirect, url_for
import sqlite3
import random

app = Flask(__name__)

DATABASE = "controle_de_notas.db"

# Lista de tabelas permitidas para inserção.
# A chave é o nome da tabela e o valor são as colunas obrigatórias.
TABELAS_PERMITIDAS = {
    "alunos": ["nome", "id_sala"],
    "salas": ["nome"],
    "disciplinas": ["nome"],
    "bimestres": ["nome"],
    "notas": ["id_aluno", "id_disciplina", "valor", "id_bimestre"],
}

"""
STATIC_FILE_DIRECTORY = "static"

# Serve os arquivos estáticos
@app.route("/static/<path:filename>")
def serve_specific_file(filename):
    return send_from_directory(STATIC_FILE_DIRECTORY, filename)
"""


# ----- Banco de Dados -----
# Códigos da documentação: https://flask.palletsprojects.com/en/stable/patterns/sqlite3/
# Usado para iniciar a conexão com o banco de dados
def get_db():
    """Abre uma conexão com o banco e reaproveita durante a request."""
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        # Retorna os resultados como dicionário (nome das colunas)
        db.row_factory = sqlite3.Row
        # Ativa chaves estrangeiras
        db.execute("PRAGMA foreign_keys = ON;")
    return db


# Usado para encerrar a conexão com o banco de dados
@app.teardown_appcontext
def close_connection(exception):
    """Fecha a conexão com o banco ao final do ciclo da request."""
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


# Usado para fazer uma consulta no banco de dados
def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


# Inicia o banco de dados
def init_db():
    """Cria as tabelas se não existirem."""
    db = get_db()

    # Inicia o banco de dados de acordo com schema.sql
    with app.open_resource("schema.sql", mode="r") as f:
        db.cursor().executescript(f.read())

    db.commit()
    print("Banco de dados e tabelas criados com sucesso!")


# Popula o banco de dados
def populate_db():
    """Popula tabelas com dados iniciais se estiverem vazias."""
    db = get_db()
    cursor = db.cursor()

    # --- Salas ---
    salas = [
        "1º ano A",
        "1º ano B",
        "1º ano C",
        "1º ano D",
        "2º ano A",
        "2º ano B",
        "2º ano C",
        "2º ano D",
        "3º ano A",
        "3º ano B",
        "3º ano C",
        "3º ano D",
    ]
    # Verifica quantos registros já existem na tabela salas
    cursor.execute("SELECT COUNT(*) FROM salas;")
    if cursor.fetchone()[0] == 0:  # Se for 0, significa que está vazio
        cursor.executemany(
            "INSERT INTO salas (nome) VALUES (?);", [(s,) for s in salas]
        )
        print("Salas inseridas.")

    # --- Alunos ---
    alunos = [
        ("Camila", "2º ano D"),
        ("Júlio", "1º ano A"),
        ("Fernanda", "3º ano B"),
        ("Marcos", "1º ano C"),
        ("Ana", "3º ano A"),
        ("Ricardo", "2º ano A"),
        ("Renata", "1º ano D"),
        ("Vítor", "2º ano B"),
        ("Rosângela", "3º ano D"),
        ("Fábio", "2º ano C"),
    ]

    cursor.execute("SELECT COUNT(*) FROM alunos;")
    if cursor.fetchone()[0] == 0:
        for nome, sala in alunos:
            # Busca o id_sala correspondente ao nome da sala
            cursor.execute("SELECT id_sala FROM salas WHERE nome = ?;", (sala,))
            id_sala = cursor.fetchone()["id_sala"]
            # Insere o aluno na tabela alunos com nome e id_sala associado
            cursor.execute(
                "INSERT INTO alunos (nome, id_sala) VALUES (?, ?);", (nome, id_sala)
            )
        print("Alunos inseridos.")

    # --- Bimestres ---
    bimestres = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"]
    cursor.execute("SELECT COUNT(*) FROM bimestres;")
    if cursor.fetchone()[0] == 0:
        cursor.executemany(
            "INSERT INTO bimestres (nome) VALUES (?);", [(b,) for b in bimestres]
        )
        print("Bimestres inseridos.")

    # --- Disciplinas ---
    disciplinas = ["Matemática", "Português", "História", "Geografia", "Ciências"]
    cursor.execute("SELECT COUNT(*) FROM disciplinas;")
    if cursor.fetchone()[0] == 0:
        cursor.executemany(
            "INSERT INTO disciplinas (nome) VALUES (?);", [(d,) for d in disciplinas]
        )
        print("Disciplinas inseridas.")

    # --- Notas ---
    cursor.execute("SELECT COUNT(*) FROM notas;")
    if cursor.fetchone()[0] == 0:
        # pega todos alunos, disciplinas e bimestres
        cursor.execute("SELECT id_aluno FROM alunos;")
        alunos_ids = [row["id_aluno"] for row in cursor.fetchall()]

        cursor.execute("SELECT id_disciplina FROM disciplinas;")
        disciplinas_ids = [row["id_disciplina"] for row in cursor.fetchall()]

        cursor.execute("SELECT id_bimestre FROM bimestres;")
        bimestres_ids = [row["id_bimestre"] for row in cursor.fetchall()]

        # gera notas aleatórias (6 a 10) para cada combinação aluno x disciplina x bimestre
        for id_aluno in alunos_ids:
            for id_disciplina in disciplinas_ids:
                for id_bimestre in bimestres_ids:
                    valor = round(random.uniform(6.0, 10.0), 1)
                    cursor.execute(
                        "INSERT INTO notas (id_aluno, id_disciplina, valor, id_bimestre) VALUES (?, ?, ?, ?);",
                        (id_aluno, id_disciplina, valor, id_bimestre),
                    )

        print("Notas inseridas.")

    db.commit()
    print("Banco de dados populado com sucesso!")


# ----- Rotas -----
# --- Páginas ---
# Ler/Listar
@app.route("/")
def index():
    # Faz uma requisição por todos os alunos
    alunos = query_db(
        """
        SELECT 
            alunos.id_aluno, 
            alunos.nome, 
            salas.nome AS nome_sala -- Cria um alias
        FROM alunos
        -- Une alunos.id_sala a salas.id_sala
        JOIN salas ON alunos.id_sala = salas.id_sala
        ORDER BY salas.nome;"""
    )

    return render_template("index.html", alunos=alunos)


# Criar
@app.route("/adicionar.html")
def adicionar_html():

    # Faz uma requisição por todos os bimestres
    bimestres = query_db(
        """
        SELECT 
            bimestres.id_bimestre, 
            bimestres.nome
        FROM bimestres
        ORDER BY bimestres.nome;"""
    )

    # Faz uma requisição por todas as disciplinas
    disciplinas = query_db(
        """
        SELECT 
            disciplinas.id_disciplina, 
            disciplinas.nome
        FROM disciplinas
        ORDER BY disciplinas.nome;"""
    )

    # Faz uma requisição por todas as salas
    salas = query_db(
        """
        SELECT 
            salas.id_sala, 
            salas.nome
        FROM salas
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todas as notas
    notas = query_db(
        """
        SELECT 
            notas.id_nota, 
            notas.valor, 
            -- Cria aliases
            alunos.nome AS nome_aluno,
            disciplinas.nome AS nome_disciplina,
            bimestres.nome AS nome_bimestre
        FROM notas
        -- Une notas.id_aluno, notas.id_disciplina e notas.id_bimestre
        JOIN alunos ON notas.id_aluno = alunos.id_aluno
        JOIN disciplinas ON notas.id_disciplina = disciplinas.id_disciplina
        JOIN bimestres ON notas.id_bimestre = bimestres.id_bimestre
        ORDER BY notas.id_nota;"""
    )

    return render_template(
        "adicionar.html",
        bimestres=bimestres,
        disciplinas=disciplinas,
        salas=salas,
        notas=notas,
    )


# Excluir
@app.route("/excluir.html")
def excluir_html():
    # Faz uma requisição por todos os bimestres
    bimestres = query_db(
        """
        SELECT 
            bimestres.id_bimestre, 
            bimestres.nome
        FROM bimestres
        ORDER BY bimestres.nome;"""
    )

    # Faz uma requisição por todas as disciplinas
    disciplinas = query_db(
        """
        SELECT 
            disciplinas.id_disciplina, 
            disciplinas.nome
        FROM disciplinas
        ORDER BY disciplinas.nome;"""
    )

    # Faz uma requisição por todas as salas
    salas = query_db(
        """
        SELECT 
            salas.id_sala, 
            salas.nome
        FROM salas
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todos os alunos
    alunos = query_db(
        """
        SELECT 
            alunos.id_aluno, 
            alunos.nome, 
            salas.nome AS nome_sala -- Cria um alias
        FROM alunos
        -- Une alunos.id_sala a salas.id_sala
        JOIN salas ON alunos.id_sala = salas.id_sala
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todas as notas
    notas = query_db(
        """
        SELECT 
            notas.id_nota, 
            notas.valor, 
            -- Cria aliases
            alunos.nome AS nome_aluno,
            disciplinas.nome AS nome_disciplina,
            bimestres.nome AS nome_bimestre
        FROM notas
        -- Une notas.id_aluno, notas.id_disciplina e notas.id_bimestre
        JOIN alunos ON notas.id_aluno = alunos.id_aluno
        JOIN disciplinas ON notas.id_disciplina = disciplinas.id_disciplina
        JOIN bimestres ON notas.id_bimestre = bimestres.id_bimestre
        ORDER BY alunos.nome;"""
    )

    return render_template(
        "excluir.html",
        bimestres=bimestres,
        disciplinas=disciplinas,
        salas=salas,
        alunos=alunos,
        notas=notas,
    )


# Atualizar
@app.route("/atualizar.html")
def atualizar_html():

    # Faz uma requisição por todos os bimestres
    bimestres = query_db(
        """
        SELECT 
            bimestres.id_bimestre, 
            bimestres.nome
        FROM bimestres
        ORDER BY bimestres.nome;"""
    )

    # Faz uma requisição por todas as disciplinas
    disciplinas = query_db(
        """
        SELECT 
            disciplinas.id_disciplina, 
            disciplinas.nome
        FROM disciplinas
        ORDER BY disciplinas.nome;"""
    )

    # Faz uma requisição por todas as salas
    salas = query_db(
        """
        SELECT 
            salas.id_sala, 
            salas.nome
        FROM salas
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todos os alunos
    alunos = query_db(
        """
        SELECT 
            alunos.id_aluno, 
            alunos.nome, 
            salas.nome AS nome_sala -- Cria um alias
        FROM alunos
        -- Une alunos.id_sala a salas.id_sala
        JOIN salas ON alunos.id_sala = salas.id_sala
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todas as notas
    notas = query_db(
        """
        SELECT 
            notas.id_nota, 
            notas.valor, 
            -- Cria aliases
            alunos.nome AS nome_aluno,
            disciplinas.nome AS nome_disciplina,
            bimestres.nome AS nome_bimestre
        FROM notas
        -- Une notas.id_aluno, notas.id_disciplina e notas.id_bimestre
        JOIN alunos ON notas.id_aluno = alunos.id_aluno
        JOIN disciplinas ON notas.id_disciplina = disciplinas.id_disciplina
        JOIN bimestres ON notas.id_bimestre = bimestres.id_bimestre
        ORDER BY alunos.nome;"""
    )

    return render_template(
        "atualizar.html",
        bimestres=bimestres,
        disciplinas=disciplinas,
        salas=salas,
        alunos=alunos,
        notas=notas,
    )


# --- API ---
@app.route("/api/alunos/<int:id_sala>")
# Alunos por sala
def obter_alunos_por_sala(id_sala):
    alunos = query_db(
        """
        SELECT 
            alunos.id_aluno, 
            alunos.nome
        FROM alunos
        WHERE alunos.id_sala = ?
        ORDER BY alunos.nome;
        """,
        (id_sala,),
    )
    return jsonify([dict(a) for a in alunos])


# Notas
@app.route("/api/notas")
def obter_notas():
    id_aluno = request.args.get("id_aluno")  # parâmetro opcional
    nome = request.args.get("nome")  # parâmetro opcional

    # Base da query
    query = """
        SELECT 
            notas.id_nota,
            alunos.nome AS aluno,
            disciplinas.nome AS disciplina,
            bimestres.nome AS bimestre,
            notas.valor
        FROM notas
        JOIN alunos ON notas.id_aluno = alunos.id_aluno
        JOIN disciplinas ON notas.id_disciplina = disciplinas.id_disciplina
        JOIN bimestres ON notas.id_bimestre = bimestres.id_bimestre
    """
    params = []

    # Filtros dinâmicos
    if id_aluno:
        query += " WHERE alunos.id_aluno = ?"
        params.append(id_aluno)
    elif nome:
        query += " WHERE alunos.nome LIKE ?"
        params.append(f"%{nome}%")

    # Ordenação
    query += " ORDER BY alunos.nome, disciplinas.nome, bimestres.id_bimestre;"

    # Executa query
    notas = query_db(query, params)
    return jsonify([dict(n) for n in notas])


# Adicionar dado
@app.route("/api/adicionar", methods=["POST"])
def adicionar_item():
    try:
        data = request.get_json()
        if not data:
            return (
                jsonify({"sucesso": False, "mensagem": "Requisição JSON inválida."}),
                400,
            )

        nome_tabela = data.get("tabela")
        valores = data.get("valores")

        # Validação do nome da tabela
        if not nome_tabela or nome_tabela not in TABELAS_PERMITIDAS:
            return (
                jsonify(
                    {
                        "sucesso": False,
                        "mensagem": f"Inserção não permitida na tabela: {nome_tabela}.",
                    }
                ),
                403,
            )

        # Validação dos dados
        if not valores or not isinstance(valores, dict):
            return (
                jsonify(
                    {
                        "sucesso": False,
                        "mensagem": "Dados de valores inválidos ou ausentes.",
                    }
                ),
                400,
            )

        # Validação das colunas obrigatórias
        colunas_obrigatorias = TABELAS_PERMITIDAS.get(nome_tabela)
        if not all(col in valores for col in colunas_obrigatorias):
            return (
                jsonify(
                    {
                        "sucesso": False,
                        "mensagem": f"Colunas obrigatórias ausentes para a tabela '{nome_tabela}'.",
                    }
                ),
                400,
            )

        # Monta a requisição dinamicamente
        colunas = ", ".join(valores.keys())
        placeholders = ", ".join(["?"] * len(valores))
        query = f"INSERT INTO {nome_tabela} ({colunas}) VALUES ({placeholders})"
        valores_tuple = tuple(valores.values())

        # Executa a inserção
        db = get_db()
        cursor = db.cursor()
        cursor.execute(query, valores_tuple)
        db.commit()

        return (
            jsonify({"sucesso": True, "mensagem": "Item adicionado com sucesso."}),
            201,
        )
    except sqlite3.Error as e:
        # Reverte a transação em caso de erro no banco
        get_db().rollback()
        return (
            jsonify({"sucesso": False, "mensagem": f"Erro no banco de dados: {e}"}),
            500,
        )
    except Exception as e:
        return (
            jsonify({"sucesso": False, "mensagem": f"Ocorreu um erro interno: {e}"}),
            500,
        )


# Executa init/populate no contexto da aplicação
if __name__ == "__main__":
    with app.app_context():
        init_db()
        populate_db()
    app.run(debug=True)
