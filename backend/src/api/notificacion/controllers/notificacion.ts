/**
 * notificacion controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::notificacion.notificacion', ({ strapi }) => ({
  async find(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesión.');
    }

    const notificaciones = await strapi.db.query('api::notificacion.notificacion').findMany({
      where: {
        destinatario: { id: ctx.state.user.id },
        publishedAt: { $notNull: true },
      },
      orderBy: { createdAt: 'desc' },
      populate: {
        respuesta: {
          populate: { autor: true },
        },
      },
    });

    const sanitize = (u: any) => u ? { id: u.id, username: u.username } : null;

    const data = notificaciones.map((n: any) => ({
      ...n,
      respuesta: n.respuesta
        ? { ...n.respuesta, autor: sanitize(n.respuesta.autor) }
        : null,
    }));

    return { data, meta: { pagination: { total: data.length } } };
  },

  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesión.');
    }

    const { id } = ctx.params;

    // Verify ownership: only the destinatario can update their notification
    const notif = await strapi.db.query('api::notificacion.notificacion').findOne({
      where: { id: Number(id) },
      populate: ['destinatario'],
    });

    if (!notif) return ctx.notFound();
    if (String((notif as any).destinatario?.id) !== String(ctx.state.user.id)) {
      return ctx.forbidden('No tienes permiso para modificar esta notificación.');
    }

    const { leida } = ctx.request.body?.data || {};

    const updated = await strapi.db.query('api::notificacion.notificacion').update({
      where: { id: Number(id) },
      data: { leida: Boolean(leida) },
    });

    return { data: updated };
  },
}));
