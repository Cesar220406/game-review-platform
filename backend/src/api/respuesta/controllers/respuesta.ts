/**
 * respuesta controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::respuesta.respuesta', ({ strapi }) => ({
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesión para responder.');
    }

    const { contenido, comentario: comentarioId } = ctx.request.body?.data || {};

    if (!contenido?.trim()) {
      return ctx.badRequest('El contenido es obligatorio.');
    }
    if (!comentarioId) {
      return ctx.badRequest('El comentario es obligatorio.');
    }

    const autorId = ctx.state.user.id;

    // 1. Crear la respuesta con relaciones via connect
    const respuesta = await strapi.db.query('api::respuesta.respuesta').create({
      data: {
        contenido: contenido.trim(),
        publishedAt: new Date(),
        autor: { connect: [{ id: autorId }] },
        comentario: { connect: [{ id: Number(comentarioId) }] },
      },
      populate: ['autor'],
    });

    // 2. Crear notificación si el autor del comentario es diferente
    try {
      const comentario = await strapi.db.query('api::comentario.comentario').findOne({
        where: { id: Number(comentarioId) },
        populate: ['autor'],
      });

      const autorComentarioId = (comentario as any)?.autor?.id;

      if (autorComentarioId && String(autorComentarioId) !== String(autorId)) {
        await strapi.db.query('api::notificacion.notificacion').create({
          data: {
            leida: false,
            publishedAt: new Date(),
            destinatario: { connect: [{ id: autorComentarioId }] },
            respuesta: { connect: [{ id: respuesta.id }] },
          },
        });
      }
    } catch (error) {
      strapi.log.error('[respuesta controller] Error al crear notificación:', error);
    }

    const sanitize = (u: any) => u ? { id: u.id, username: u.username } : null;
    return { data: { ...(respuesta as any), autor: sanitize((respuesta as any).autor) } };
  },
}));
