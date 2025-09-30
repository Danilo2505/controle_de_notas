from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

"""
STATIC_FILE_DIRECTORY = "static"

# Serve os arquivos estáticos
@app.route("/static/<path:filename>")
def serve_specific_file(filename):
    return send_from_directory(STATIC_FILE_DIRECTORY, filename)
"""


# Banco de dados
def init_db():
    conn = sqlite3.connect("controle_de_notas.db")
    cursor = conn.cursor()

    # Ativar chaves estrangeiras
    cursor.execute("PRAGMA foreign_keys = ON;")

    # Bimestres
    sql_disciplinas = """
    CREATE TABLE IF NOT EXISTS bimestre (
        id_bimestre INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    );
    """

    # Disciplinas
    sql_disciplinas = """
    CREATE TABLE IF NOT EXISTS disciplinas (
        id_disciplina INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    );
    """

    # Salas
    sql_salas = """
    CREATE TABLE IF NOT EXISTS salas (
        id_sala INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    );
    """

    # Alunos
    sql_alunos = """
    CREATE TABLE IF NOT EXISTS alunos (
        id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_nascimento TEXT
    );
    """

    # Notas
    sql_notas = """
    CREATE TABLE IF NOT EXISTS notas (
        id_nota INTEGER PRIMARY KEY AUTOINCREMENT,
        id_aluno INTEGER NOT NULL,
        id_disciplina INTEGER NOT NULL,
        valor REAL NOT NULL,
        bimestre INTEGER NOT NULL,
        FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE,
        FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE
    );
    """

    cursor.execute(sql_alunos)
    cursor.execute(sql_salas)
    cursor.execute(sql_disciplinas)
    cursor.execute(sql_notas)

    conn.commit()
    conn.close()
    print("Banco de dados e tabelas criados com sucesso!")



init_db()


# Ler
@app.route("/")
def index():
    return render_template("index.html")


# Criar
@app.route("/adicionar.html")
def adicionar_html():
    return render_template("adicionar.html")


# Excluir
@app.route("/excluir.html")
def excluir_html():
    return render_template("excluir.html")


# Atualizar
@app.route("/atualizar.html")
def atualizar_html():
    return render_template("atualizar.html")


if __name__ == "__main__":
    app.run(debug=True)
