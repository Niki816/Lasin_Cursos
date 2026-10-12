import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    console.log('📧 [EMAIL] Config SMTP:', {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      passDefinida: !!env.SMTP_PASS,
      passLongitud: env.SMTP_PASS?.length,
    });

    if (env.SMTP_HOST && env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      });
    }
  }
  return transporter;
};

// Verifica las credenciales al arrancar el servidor (llamar desde server.js)
export const verifyEmailConfig = async () => {
  const t = getTransporter();
  if (!t) {
    console.warn('📧 [EMAIL] ⚠️ SMTP no configurado (faltan SMTP_HOST o SMTP_USER)');
    return;
  }
  try {
    await t.verify();
    console.log('📧 [EMAIL] ✅ SMTP listo: Gmail acepta las credenciales');
  } catch (e) {
    console.error('📧 [EMAIL] ❌ SMTP falló:', e.code, e.message);
  }
};

// Envía y deja registrado qué respondió Gmail
const enviarCorreo = async (tipo, opciones) => {
  const t = getTransporter();
  if (!t) {
    console.warn(`📧 [EMAIL] ❌ (${tipo}) No hay transporter: faltan SMTP_HOST o SMTP_USER`);
    return;
  }

  const info = await t.sendMail({
    from: env.SMTP_FROM || env.SMTP_USER,
    ...opciones,
  });

  console.log(`📧 [EMAIL] ✅ (${tipo}) Gmail respondió:`, {
    aceptados: info.accepted,
    rechazados: info.rejected,
    respuesta: info.response,
  });

  return info;
};

const emailTemplate = (titulo, badge, badgeColor, contenido) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0f1421; padding: 20px; margin: 0; line-height: 1.6;">
  <div style="max-width: 550px; margin: 0 auto; background: linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,20,33,0.98) 100%); border-radius: 24px; padding: 40px 32px; border: 1px solid rgba(99,102,241,0.2); box-shadow: 0 30px 80px rgba(0,0,0,0.6);">
    <span style="display: inline-block; padding: 8px 16px; background: ${badgeColor}; border-radius: 100px; font-size: 11px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 24px;">${badge}</span>
    <h2 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0 0 24px 0; letter-spacing: -0.02em;">${titulo}</h2>
    ${contenido}
    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; color: #64748B; font-size: 12px;">
      Laboratorio Superior de Informática<br>
      Este es un mensaje automático, no responder.
    </div>
  </div>
</body>
</html>
`;

const infoRow = (label, value) => `
<div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
  <span style="color: #64748B; font-size: 13px; font-weight: 600;">${label}</span>
  <span style="color: #FFFFFF; font-size: 15px; font-weight: 700; text-align: right;">${value}</span>
</div>
`;

// ============================================
// PREINSCRIPCIÓN RECIBIDA
// ============================================
export const sendConfirmationEmail = async (preinscripcion) => {
  const cursoNombre = preinscripcion.curso.nombre;
  const monto = preinscripcion.curso.costo
    ? `Bs. ${Number(preinscripcion.curso.costo).toFixed(2)}`
    : 'Consultar';
  const nombreCompleto = `${preinscripcion.nombres} ${preinscripcion.apellidoPaterno} ${preinscripcion.apellidoMaterno || ''}`.trim();

  const contenido = `
    ${infoRow('Curso', cursoNombre)}
    ${infoRow('Monto', monto)}
    ${infoRow('Nombre', nombreCompleto)}
    <div style="margin-top: 28px; padding: 20px; background: rgba(99,102,241,0.1); border-radius: 16px; border-left: 4px solid #6366F1;">
      <p style="margin: 0; color: #94A3B8; font-size: 14px; line-height: 1.7;">
        Espere que el administrador compruebe su pago y recibirá un correo de confirmación.
      </p>
    </div>
  `;

  await enviarCorreo('PREINSCRIPCION', {
    to: preinscripcion.correo,
    subject: '📋 Preinscripción recibida',
    text: `Hola ${nombreCompleto}. Recibimos tu preinscripción al curso ${cursoNombre}. Espera a que el administrador compruebe tu pago y recibirás un correo de confirmación.`,
    html: emailTemplate(
      'Preinscripción llenada correctamente',
      '⏳ Pendiente',
      'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.2) 100%)',
      contenido
    ),
  });
};

// ============================================
// ACEPTADO (incluye enlace al grupo de WhatsApp)
// ============================================
export const sendAceptadoEmail = async (preinscripcion, observacion) => {
  console.log('📧 [EMAIL] Intentando enviar email de ACEPTADO a:', preinscripcion.correo);

  const c = preinscripcion.curso;
  const horario = c.horaInicio && c.horaFin ? `${c.horaInicio} - ${c.horaFin}` : 'Por definir';
  const monto = c.costo ? `Bs. ${Number(c.costo).toFixed(2)}` : 'Consultar';
  const nombre = `${preinscripcion.nombres} ${preinscripcion.apellidoPaterno}`;

  if (!c.enlaceWhatsapp) {
    console.warn('📧 [EMAIL] ⚠️ El curso no tiene enlaceWhatsapp guardado; el correo saldrá sin el link');
  }

  const whatsappBlock = c.enlaceWhatsapp
    ? `
    <div style="margin-top: 28px; padding: 20px; background: rgba(37,211,102,0.12); border-radius: 16px; border: 1px solid rgba(37,211,102,0.35); text-align: center;">
      <p style="margin: 0 0 16px 0; color: #94A3B8; font-size: 14px;">
        Únete al grupo de WhatsApp del curso para recibir avisos y los enlaces de las clases:
      </p>
      <a href="${c.enlaceWhatsapp}" target="_blank"
         style="display: inline-block; padding: 12px 28px; background: #25D366; color: #FFFFFF; font-weight: 800; font-size: 14px; border-radius: 100px; text-decoration: none;">
        Unirme al grupo de WhatsApp
      </a>
    </div>`
    : '';

  const contenido = `
    <p style="color: #94A3B8; margin: 0 0 24px 0;">Hola <strong style="color: #FFFFFF;">${nombre}</strong>,</p>
    <p style="color: #94A3B8; margin: 0 0 24px 0;">Tu inscripción fue <span style="color: #10B981; font-weight: 700;">APROBADA</span>.</p>
    <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 24px; margin: 24px 0;">
      ${infoRow('Curso', c.nombre)}
      ${infoRow('Modalidad', c.modalidad || 'N/A')}
      ${infoRow('Inicio', c.fechaInicio ? new Date(c.fechaInicio).toLocaleDateString('es-BO') : 'Por definir')}
      ${infoRow('Horario', horario)}
      ${infoRow('Duración', c.duracion || 'N/A')}
      ${infoRow('Inversión', monto)}
    </div>
    ${observacion ? `
      <div style="margin-top: 24px; padding: 20px; background: rgba(99,102,241,0.1); border-radius: 16px; border-left: 4px solid #6366F1;">
        <p style="margin: 0; color: #94A3B8; font-size: 14px;"><strong style="color: #A5B4FC;">Detalle:</strong><br>${observacion}</p>
      </div>
    ` : ''}
    ${whatsappBlock}
  `;

  const textoPlano = [
    `Hola ${nombre},`,
    `Tu inscripción al curso "${c.nombre}" fue APROBADA.`,
    c.enlaceWhatsapp ? `Únete al grupo de WhatsApp del curso: ${c.enlaceWhatsapp}` : '',
    observacion ? `Detalle: ${observacion}` : '',
    'Laboratorio Superior de Informática',
  ]
    .filter(Boolean)
    .join('\n\n');

  await enviarCorreo('ACEPTADO', {
    to: preinscripcion.correo,
    subject: `✅ Inscripción confirmada - ${c.nombre}`,
    text: textoPlano,
    html: emailTemplate(
      'Inscripción Confirmada',
      '✅ Confirmado',
      'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(5,150,105,0.2) 100%)',
      contenido
    ),
  });
};

// ============================================
// RECHAZADO
// ============================================
export const sendRechazadoEmail = async (preinscripcion, observacion) => {
  console.log('📧 [EMAIL] Intentando enviar email de RECHAZADO a:', preinscripcion.correo);

  const c = preinscripcion.curso;
  const nombre = `${preinscripcion.nombres} ${preinscripcion.apellidoPaterno}`;

  const contenido = `
    <p style="color: #94A3B8; margin: 0 0 24px 0;">Hola <strong style="color: #FFFFFF;">${nombre}</strong>,</p>
    <p style="color: #94A3B8; margin: 0 0 24px 0;">Tu comprobante fue <span style="color: #EF4444; font-weight: 700;">RECHAZADO</span>.</p>
    <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; color: #94A3B8; font-size: 14px;"><strong style="color: #A5B4FC;">Curso:</strong> ${c.nombre}</p>
    </div>
    ${observacion ? `
      <div style="margin-top: 24px; padding: 20px; background: rgba(239,68,68,0.1); border-radius: 16px; border-left: 4px solid #EF4444;">
        <p style="margin: 0; color: #94A3B8; font-size: 14px;"><strong style="color: #FCA5A5;">Detalle:</strong><br>${observacion}</p>
      </div>
    ` : ''}
    <div style="margin-top: 28px; padding: 20px; background: rgba(99,102,241,0.15); border-radius: 16px; border: 1px solid rgba(99,102,241,0.3);">
      <p style="margin: 0; color: #A5B4FC; font-size: 14px; font-weight: 600;">🏢 Debes apersonarte al LASIN para regularizar tu inscripción.</p>
    </div>
  `;

  const textoPlano = [
    `Hola ${nombre},`,
    `Tu comprobante para el curso "${c.nombre}" fue RECHAZADO.`,
    observacion ? `Detalle: ${observacion}` : '',
    'Debes apersonarte al LASIN para regularizar tu inscripción.',
  ]
    .filter(Boolean)
    .join('\n\n');

  await enviarCorreo('RECHAZADO', {
    to: preinscripcion.correo,
    subject: `⚠️ Revisión de comprobante - ${c.nombre}`,
    text: textoPlano,
    html: emailTemplate(
      'Comprobante Rechazado',
      '⚠️ Revisión',
      'linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(220,38,38,0.2) 100%)',
      contenido
    ),
  });
};