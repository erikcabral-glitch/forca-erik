import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { ZodError } from 'zod';
import { rotas } from './routes';
import { ErroApp } from './erros';

export const app = express();

app.use(express.json());
app.use('/api', rotas);

app.use((
  erros: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (erros instanceof ZodError) {
    res.status(400).json({
      erro: erros.issues[0]?.message ?? 'Dados inválidos.',
    });
    return;
  }

  if (erros instanceof ErroApp) {
    res.status(erros.status).json({ erro: erros.message });
    return;
  }

  if (
    erros instanceof SyntaxError &&
    'status' in erros &&
    erros.status === 400
  ) {
    res.status(400).json({ erro: 'JSON inválido.' });
    return;
  }

  console.error(erros);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});