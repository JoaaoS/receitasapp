import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  let payload: { name?: string; email?: string; password?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim().toLowerCase();
  const password = (payload.password ?? '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Informe seu nome.' }, { status: 400 });
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: 'A senha precisa ter no mínimo 6 caracteres.' },
      { status: 400 }
    );
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json(
      { error: 'Servidor indisponível no momento. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }

  const { data: allowed, error: allowedErr } = await admin
    .from('allowed_emails')
    .select('email, used_at, user_id')
    .eq('email', email)
    .maybeSingle();

  if (allowedErr) {
    return NextResponse.json(
      { error: 'Não foi possível validar seu e-mail. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }

  const NOT_AUTHORIZED_MSG =
    'Este e-mail não está autorizado a criar conta. Use o e-mail informado na compra ou entre em contato com o suporte.';

  if (!allowed) {
    return NextResponse.json({ error: NOT_AUTHORIZED_MSG }, { status: 403 });
  }
  if (allowed.used_at) {
    return NextResponse.json(
      { error: 'Já existe uma conta criada com este e-mail. Acesse a página de login para entrar.' },
      { status: 409 }
    );
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (createErr || !created?.user) {
    const msg = createErr?.message ?? '';
    if (/already|duplicate|exists/i.test(msg)) {
      return NextResponse.json(
        { error: 'Já existe uma conta criada com este e-mail. Acesse a página de login para entrar.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Não foi possível criar sua conta. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }

  await admin
    .from('allowed_emails')
    .update({ used_at: new Date().toISOString(), user_id: created.user.id })
    .eq('email', email);

  return NextResponse.json({
    ok: true,
    email: created.user.email,
    name,
  });
}
