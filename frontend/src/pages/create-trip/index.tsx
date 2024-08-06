import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InviteGuestsModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { InviteGuestsStep } from "./steps/invite-guests-step";
import { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";

export function CreateTripPage() {
  const navigate = useNavigate();

  const [buttonText, setButtonText] = useState("Confirmar criação da viagem");
  const [disableButton, setDisableButton] = useState(false)
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

  const [destination, setDestination] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

  function openGuestsInput() {
    setIsGuestsInputOpen(true);
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false);
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true);
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false);
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();
    if (!email) {
      return;
    }
    if (emailsToInvite.includes(email)) {
      return;
    }
    setEmailsToInvite([...emailsToInvite, email]);

    event.currentTarget.reset();
  }
  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailToRemove
    );
    setEmailsToInvite(newEmailList);
  }
  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if(!destination) {
      return alert("Ocorreu um erro ao criar a viagem. Por favor, insira um destino.")
    }

    if(destination.length < 4 ) {
      return alert("Ocorreu um erro ao criar a viagem. Por favor, insira um destino válido.")
    }
    if(!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      return alert("Insira uma data para a viagem.")
    }

    if(emailsToInvite.length === 0) {
      return alert("Ocorreu um erro ao criar a viagem. Por favor, convide pelo menos uma pessoa para sua viagem para prosseguir.")
    }

    if(!ownerName || !ownerEmail) {
      return alert("Ocorreu um erro ao criar a viagem. Por favor, preencha seus dados para confirmar a criação da viagem.")
    }
    setDisableButton(true)
    setButtonText("Criando viagem. Aguarde....")

    const response =  await api.post("/trips", {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    })

    const { tripId } = response.data
    navigate(`/trips/${tripId}`);
  }

  return (
    <div className="h-screen flex  items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/logo.svg"
            alt="plann.er"
          />
          <p className="text-zinc-300 text-lg">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            closeGuestsInput={closeGuestsInput}
            openGuestsInput={openGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            setDestination={setDestination}
            setEventStartAndEndDates={setEventStartAndEndDates}
            eventStartAndEndDates={eventStartAndEndDates}
          />

          {isGuestsInputOpen && (
            <InviteGuestsStep
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
              emailsToInvite={emailsToInvite}
            />
          )}
        </div>

        <p className="text-zinc-500 text-sm">
          Ao planejar sua viagem pela plann.er você automaticamente concorda{" "}
          <br /> com nossos{" "}
          <a
            className="text-zinc-300 underline"
            href="#"
          >
            termos de uso
          </a>{" "}
          e{" "}
          <a
            className="text-zinc-300 underline"
            href="#"
          >
            políticas de privacidade.
          </a>
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestsModal={closeGuestsModal}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          disableButton={disableButton}
          destination={destination}
          eventStartAndEndDates={eventStartAndEndDates}
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          buttonText={buttonText}
        />
      )}
    </div>
  );
}
