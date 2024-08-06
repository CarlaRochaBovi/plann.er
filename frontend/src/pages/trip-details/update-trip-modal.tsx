import { MapPin, Calendar, X } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";
import { Button } from "../../components/button";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";

interface UpdateTripModalProps {
  closeUpdateTripModal: () => void;
}
export function UpdateTripModal({
  closeUpdateTripModal,
}: UpdateTripModalProps) {
  const { tripId } = useParams();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false);
  }
  async function putTrip() {
    if (
      !eventStartAndEndDates?.to ||
      !eventStartAndEndDates?.from ||
      !destination
    ) {
      return alert("Todos os campos são obrigatórios!");
    }
    await api.put(`/trips/${tripId}`, {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
    });
    closeUpdateTripModal();
    window.document.location.reload();
  }

  const displayedDate =
    eventStartAndEndDates &&
    eventStartAndEndDates.from &&
    eventStartAndEndDates.to
      ? format(eventStartAndEndDates.from, "d' de 'LLL")
          .concat(" até ")
          .concat(format(eventStartAndEndDates.to, "d' de 'LLL"))
      : null;



  return (
    <div className="h-screen w-screen bg-black/60 fixed inset-0 flex items-center justify-center">
      <div className="h-16 bg-zinc-900 p-4 rounded-xl flex items-center shadow-shape gap-3">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="size-5 text-zinc-400" />
          <input
            required
            type="text"
            placeholder="Para onde você vai?"
            className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1 "
            onChange={(event) => setDestination(event.target.value)}
          />
        </div>
        <button
          onClick={openDatePicker}
          className="flex items-center gap-2 text-left w-[240px]"
        >
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-lg text-zinc-400 ">
            {displayedDate || "Quando"}
          </span>
        </button>

        {isDatePickerOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-lg font-semibold">Selecione a data</h2>
                  <button>
                    <X
                      className="size-5 text-zinc-400"
                      onClick={closeDatePicker}
                    />
                  </button>
                </div>
              </div>

              <DayPicker
                mode="range"
                selected={eventStartAndEndDates}
                onSelect={setEventStartAndEndDates}
              />
            </div>
          </div>
        )}

        <div className="w-px h-6 bg-zinc-800"></div>

        <Button
          onClick={putTrip}
          variant="primary"
          size="default"
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
