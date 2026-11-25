
export default function RecentActivity() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900">
          Atividades recentes
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Últimos registros de autenticação do sistema.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Usuário</th>
              <th className="px-5 py-3 font-medium">Ação</th>
              <th className="px-5 py-3 font-medium">Data</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                colSpan={4}
                className="px-5 py-10 text-center text-gray-500"
              >
                Nenhuma atividade registrada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
