import { useState } from 'react';

const statusOptions = ['Executado', 'Em andamento', 'Pendente'];

const createEmptyRow = () => ({
  id: crypto.randomUUID(),
  lista: '',
  data: '',
  status: 'Pendente'
});

export default function App() {
  const [rows, setRows] = useState([createEmptyRow()]);

  const updateRow = (id, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value
            }
          : row
      )
    );
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, createEmptyRow()]);
  };

  const deleteRow = (id) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
  };

  return (
    <main className="container">
      <header className="header">
        <h1>Dashboard de Atividades</h1>
        <button type="button" onClick={addRow} className="add-button">
          Adicionar linha
        </button>
      </header>

      <section className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Lista</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="text"
                    value={row.lista}
                    onChange={(event) => updateRow(row.id, 'lista', event.target.value)}
                    placeholder="Digite aqui"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={row.data}
                    onChange={(event) => updateRow(row.id, 'data', event.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={row.status}
                    onChange={(event) => updateRow(row.id, 'status', event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteRow(row.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
