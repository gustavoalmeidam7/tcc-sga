import { Link } from "react-router-dom";

function Register() {
  return (
    <>
      <main>
        <div className="main-wrap">
          <section className="esq">
            <div className="container text-center">
              <h1>
                Cadastre-se
                <br />
                Para acessar o sistema
              </h1>
              <p className="muted">
                Crie sua conta para gerenciar ambulâncias, motoristas e viagens.
              </p>
            </div>
          </section>

          <section className="dir">
            <div className="login card">
              <h1 className="text-center">Cadastro</h1>
              <form className="textfield" action="#" method="POST">
                <div className="form-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf">CPF</label>
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="Digite o seu CPF"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@exemplo.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="senha">Senha</label>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Digite a senha..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm_senha">Confirmar senha</label>
                  <input
                    id="confirm_senha"
                    name="confirm_senha"
                    type="password"
                    placeholder="Confirme a senha..."
                    required
                  />
                </div>
                <button className="btn" type="submit">
                  Cadastrar
                </button>
              </form>
              <div className="login-links">
                <div>
                  <Link to="/login">Já tenho conta</Link>
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

export default Register;
