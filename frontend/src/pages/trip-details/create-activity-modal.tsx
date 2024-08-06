import { X, Tag, Calendar } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void;
}

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function CreateActivityModal({
  closeCreateActivityModal,
}: CreateActivityModalProps) {

  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()

  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
  }, [tripId])

  const displayedDate = trip
  ? format(trip.starts_at, "d' de 'LLLL yyyy", { locale: ptBR }).concat(' até ').concat(format(trip.ends_at, "d' de 'LLLL yyyy", { locale: ptBR }))
  : null

  useEffect(() => {
    if (tripId) {
      api.get(`/trips/${tripId}`)
        .then(response => setTrip(response.data.trip))
        .catch(error => {
          alert("Houve um problema ao carregar a viagem: " + error.message);
        });
    }
  }, [tripId]);

  async function createActivity(event:FormEvent<HTMLFormElement>) {

    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const title = data.get('title')?.toString()
    const occurs_at = data.get('occurs_at')?.toString()

    if(dayjs(occurs_at).isBefore(trip?.starts_at)) {
      return alert("Por favor selecione uma data para sua atividade que ocorra durante a viagem.")
    }
    try {
      await api.post(`/trips/${tripId}/activities`, {
        title,
        occurs_at,
      });
      closeCreateActivityModal(); // Feche o modal após sucesso
    } catch (error) {
      console.error("Error creating activity:", error); // Adicione log para depuração
      alert("Houve um problema ao criar sua atividade: " + error);
    }

    window.document.location.reload()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>
            <button
              onClick={closeCreateActivityModal}
              type="button"
            >
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Para concluir a criação da atividade desejada em  {" "}
            <span className="text-zinc-100 font-semibold">
              {trip?.destination},
            </span>
             {" "}nas datas de{" "}
            <span className="text-zinc-100 font-semibold">
            {displayedDate}

            </span>,{" "}
            preencha os dados abaixo:
          </p>
        </div>

        <form onSubmit={createActivity} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <input
              name="title"
              placeholder="Qual a atividade?"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <Calendar className="text-zinc-400 size-5" />
              <input
                type="datetime-local"
                name="occurs_at"
                placeholder="Data e horário da atividade"
                className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              />
            </div>
          </div>

          <Button
            size="full"
            variant="primary"
            type="submit"
          >
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  );
}
