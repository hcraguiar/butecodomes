export default function UserAdminPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gerenciar Usuários</h2>
      {/* Lista de usuários com dados e ações */}
      <ul className="space-y-4">
        {/* Exemplo de usuário */}
        <li className="p-4 border rounded shadow-sm">
          <h3 className="font-bold">Maria Silva</h3>
          <p className="text-sm text-muted-foreground">maria@email.com</p>
          <p className="text-sm">Convidado por: João | Convites: 2 usados</p>
          <div className="mt-2 space-x-2">
            <button className="btn">Resetar senha</button>
            <button className="btn text-red-600">Excluir conta</button>
          </div>
        </li>
      </ul>
    </div>
  );
}
