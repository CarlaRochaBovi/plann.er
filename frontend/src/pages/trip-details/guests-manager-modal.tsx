import { AtSign, Plus, X } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

interface AddGuestsManagerModalProps {
  closeGuestsManagerModal: () => void;
}

interface Participants {
  id: string;
  name: string | undefined;
  email: string;
  is_confirmed: boolean;
}

export function GuestsManagerModal({
  closeGuestsManagerModal,
}: AddGuestsManagerModalProps) {
  const { tripId } = useParams();
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  useEffect(() => {
    api.get(`/trips/${tripId}/participants`).then((response) => {
      setParticipants(response.data.participants);
    });
  }, [tripId]);


  function removeEmailsFromEmailsToInvite(email: string) {
    setEmailsToInvite((prevEmailsToInvite) => prevEmailsToInvite.filter(emailsToInvite => emailsToInvite !== email))
  }
  async function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if (!email) {
      return alert("Por favor, insira o e-mail da pessoa que você quer convidar.");
    }
    setEmailsToInvite((prevEmailsToInvite) => [...prevEmailsToInvite, email])
    setTimeout(() => removeEmailsFromEmailsToInvite(email), 10000)
    api.post(`/trips/${tripId}/invites`, { email });
    event.currentTarget.reset();
  }

  function removeEmailFromInvites(participantId: string, email: string) {
    setEmailsToInvite((prevEmailsToInvite) => prevEmailsToInvite.filter((emailsToInvite) => emailsToInvite !== email));
    api.delete(`/trips/${tripId}/participants/${participantId}`).then(() => {
      setParticipants((prevParticipants) => prevParticipants.filter((participant) => participant.id !== participantId));
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Selecionar convidados</h2>
            <button onClick={closeGuestsManagerModal} type="button">
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na
            viagem.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 max-h-[500px] overflow-auto">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
            >
              <span className="text-zinc-300">{participant.email}</span>
              <button
                onClick={() => removeEmailFromInvites(participant.id, participant.email)}
                type="button"
              >
                <X className="size-4 text-zinc-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-zinc-800" />

        <form
          onSubmit={addNewEmailToInvite}
          className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2"
        >
          <div className="px-2 flex items-center flex-1 gap-2">
            <AtSign className="text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Digite o e-mail do convidado"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              required
            />
          </div>
          <Button variant="primary" type="submit">
            Convidar
            <Plus className="size-5" />
          </Button>
        </form>
      </div>

      <div className="flex flex-col fixed left-0 space-y-2.5">
        {emailsToInvite.map(((emailtoInvite, index) => (
          <div key={index} className=" h-34 w-72 rounded-r-xl flex p-5 bg-zinc-900 items-center justify-center shadow-shape">
            <p className="text-sm ml-5 text-zinc-400">O convidado {emailtoInvite} receberá um e-mail de confirmação daqui a pouco, logo aparecerá na lista de convidados </p>
          </div>
        )))
      }
      </div>

    </div>
  );
}
