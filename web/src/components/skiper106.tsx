import { useState } from 'react';
import type { FormEvent } from 'react';

type LoginPayload = {
  email: string;
  password: string;
};

type Skiper106Props = {
  onSubmit: (dados: LoginPayload) => void;
  isLoading: boolean;
};

export function Skiper106({ onSubmit, isLoading }: Skiper106Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      email,
      password,
    });
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-7 shadow-[0_30px_80px_rgba(59,130,246,0.18)] backdrop-blur-xl sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-violet-300/80">
            SKIPER UI
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Painel Login</h1>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 text-lg text-violet-200 shadow-[0_0_32px_rgba(168,85,247,0.35)]">
          S
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            E-mail
          </label>
          <div className="group rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 transition-all duration-200 focus-within:border-violet-400/60 focus-within:bg-white/10 focus-within:shadow-[0_0_0_1px_rgba(168,85,247,0.4)]">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="eduardo@braga.com"
              className="w-full border-0 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Senha
          </label>
          <div className="group rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 transition-all duration-200 focus-within:border-violet-400/60 focus-within:bg-white/10 focus-within:shadow-[0_0_0_1px_rgba(168,85,247,0.4)]">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full border-0 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_35px_rgba(99,102,241,0.45)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(99,102,241,0.55)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-500">
        <span className="h-px flex-1 bg-white/10" />
        <span className="px-3">Acesso</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}
