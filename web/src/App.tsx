import { useState } from 'react';
import { Skiper106 } from './components/skiper106';

function App() {
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', msg: string }>({ 
    type: 'idle', 
    msg: '' 
  });

  const handleLogin = async (dados: any) => {
    setStatus({ type: 'loading', msg: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Login efetuado com sucesso!' });
        console.log('Token recebido:', data);
      } else {
        setStatus({ type: 'error', msg: data.message || 'Credenciais inválidas.' });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: 'Erro ao conectar ao servidor.' });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#070b14] bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.12),transparent_35%)] p-4 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 -z-10 rounded-[30px] bg-gradient-to-br from-violet-500/20 via-sky-500/10 to-emerald-400/10 blur-2xl" />

          <Skiper106
            onSubmit={handleLogin}
            isLoading={status.type === 'loading'}
          />

          {status.msg && (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-center text-sm font-medium backdrop-blur-sm ${
                status.type === 'success'
                  ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-400/30 bg-rose-500/10 text-rose-300'
              }`}
            >
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;