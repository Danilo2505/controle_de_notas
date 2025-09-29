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
    # Conecta ao banco de dados (se não existir, ele será criado)
    conn = sqlite3.connect("controle_de_notas.db")

    # Cria um objeto cursor para executar comandos SQL
    cursor = conn.cursor()

    # Comandos SQL para criar as tabelas
    # Alunos
    sql_alunos = """
    CREATE TABLE IF NOT EXISTS alunos (
        id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_nascimento DATE
    );
    """
    # Salas
    sql_salas = """
    CREATE TABLE IF NOT EXISTS salas (
        id_sala INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT NOT NULL UNIQUE,
        capacidade INTEGER
    );
    """
    # Disciplinas
    sql_disciplinas = """
    CREATE TABLE IF NOT EXISTS disciplinas (
        id_disciplina INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    );
    """
    # Notas
    sql_notas = """
    CREATE TABLE IF NOT EXISTS notas (
        id_nota INTEGER PRIMARY KEY AUTOINCREMENT,
        id_aluno INTEGER NOT NULL,
        id_disciplina INTEGER NOT NULL,
        valor REAL NOT NULL,
        FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno),
        FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id_disciplina)
    );
    """

    # Executa os comandos de criação das tabelas
    cursor.execute(sql_alunos)
    cursor.execute(sql_salas)
    cursor.execute(sql_disciplinas)
    cursor.execute(sql_notas)

    # Confirma as alterações no banco de dados
    conn.commit()

    # Fecha a conexão
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
