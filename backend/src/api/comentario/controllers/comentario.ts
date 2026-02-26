/**
 * comentario controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comentario.comentario', ({ strapi }) => ({
  async find(ctx) {
    const query = ctx.query as Record<string, any>;

    // Parse filters: supports filters[videojuego][id][$eq] and filters[articulo][id][$eq]
    const where: Record<string, any> = { publishedAt: { $notNull: true } };
    const f = query.filters || {};
    if (f.videojuego?.id?.$eq) where.videojuego = { id: { $eq: Number(f.videojuego.id.$eq) } };
    if (f.articulo?.id?.$eq) where.articulo = { id: { $eq: Number(f.articulo.id.$eq) } };

    const comentarios = await strapi.db.query('api::comentario.comentario').findMany({
      where,
      orderBy: { createdAt: 'asc' },
      populate: {
        autor: true,
        respuestas: { populate: { autor: true }, orderBy: { createdAt: 'asc' } },
      },
    });

    // Sanitize: only expose safe user fields
    const sanitize = (u: any) =>
      u ? { id: u.id, username: u.username } : null;

    const data = comentarios.map((c: any) => ({
      ...c,
      autor: sanitize(c.autor),
      respuestas: (c.respuestas ?? []).map((r: any) => ({
        ...r,
        autor: sanitize(r.autor),
      })),
    }));

    return { data, meta: { pagination: { total: data.length } } };
  },

  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesión para comentar.');
    }

    const { contenido } = ctx.request.body?.data || {};
    if (!contenido?.trim()) {
      return ctx.badRequest('El contenido es obligatorio.');
    }

    // Los IDs de relación vienen como query params para evitar
    // la validación del body de Strapi v5 que rechaza relaciones del cliente.
    const { _vj, _art } = ctx.query as { _vj?: string; _art?: string };

    // En Strapi v5 las relaciones se guardan en tablas de enlace separadas.
    // strapi.db.query con el formato { connect: [id] } las escribe correctamente.
    const data: Record<string, unknown> = {
      contenido: contenido.trim(),
      publishedAt: new Date(),
      autor: { connect: [{ id: ctx.state.user.id }] },
    };

    if (_vj) data.videojuego = { connect: [{ id: Number(_vj) }] };
    if (_art) data.articulo = { connect: [{ id: Number(_art) }] };

    const entry = await strapi.db.query('api::comentario.comentario').create({
      data,
      populate: ['autor', 'respuestas'],
    });

    const sanitize = (u: any) => u ? { id: u.id, username: u.username } : null;
    return { data: { ...entry, autor: sanitize((entry as any).autor) } };
  },
}));
