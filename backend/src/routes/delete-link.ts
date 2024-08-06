import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function deleteLink(app: FastifyInstance) {
  const deleteSchema = z.object({
    tripId: z.string().uuid(), // Validate if the trip ID is a valid UUID
    linkId: z.string().uuid(), // Validate if the link ID is a valid UUID
  });

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/trips/:tripId/links/:linkId",
    {
      schema: {
        params: deleteSchema
      },
    },
    async (request, reply) => {
      const { linkId } = request.params;

      try {
        await prisma.link.delete({
          where: { id: linkId },
        });

          reply.status(204).send(); // Retorna um status 204 (No Content) para indicar que o recurso foi deletado com sucesso
      } catch (error) {
          console.error(error);
          reply.status(500).send({ message: 'Error on deleting...' }); // Retorna um status 500 (Internal Server Error) em caso de erro
      }
    }
  );
}
