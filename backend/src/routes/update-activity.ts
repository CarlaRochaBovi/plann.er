import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ClientError } from '../errors/client-error'

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/activities/:activityId',
    {
      schema: {
        params: z.object({
          activityId: z.string().uuid(),
        }),
        body: z.object({
          is_confirmed: z.boolean()
        }),
      },
    },
    async (request) => {
      const { activityId } = request.params
      const { is_confirmed } = request.body

      const activity = await prisma.activity.findUnique({
        where: { id: activityId }
      })

      if (!activity) {
        throw new ClientError('Activity not found')
      }

      await prisma.activity.update({
        where: { id: activityId },
        data: {
          is_confirmed: true,
        },
      })

      return { activityId: activity.id }
    },
  )
}
