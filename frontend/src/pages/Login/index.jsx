import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <main>
        <div className="main-wrap">
          <section className="esq">
            <div className="container text-center">
              <h1>
                Faça login
                <br />
                Para entrar no sistema
              </h1>
              <p className="muted">
                Acesse suas rotinas e gerencie ambulâncias, motoristas e
                viagens.
              </p>
            </div>
          </section>

          <section className="dir">
            <div className="login card">
              <h1 className="text-center">Login</h1>
              <form className="textfield" action="#" method="POST">
                <div className="form-group">
                  <label for="cpf">CPF</label>
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="Digite o seu CPF"
                    required
                  />
                </div>
                <div className="form-group">
                  <label for="senha">Senha</label>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Digite a senha..."
                    required
                  />
                </div>
                <button className="btn" type="submit">
                  Entrar
                </button>
              </form>
              <div className="login-links">
                <div>
                  <Link to="/registro">Cadastro!</Link>
                </div>
                <div>
                  <Link to="/rec_senha">Esqueceu a senha?</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Login;
