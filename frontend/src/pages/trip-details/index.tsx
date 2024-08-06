import { useState } from "react";
import { CreateActivityModal } from "./create-activity-modal";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { Plus } from "lucide-react";
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { AddImportantLinksModal } from "./add-important-links-modal";
import { GuestsManagerModal } from "./guests-manager-modal";
import { UpdateTripModal } from "./update-trip-modal";
export function TripDetailsPage() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] =
    useState(false);
  const [isAddImportantLinkModalOpen, setIsImportantLinkModalOpen] =
    useState(false);
  const [isGuestsManagerModalOpen, setIsGuestsManagerModalOpen] =
    useState(false);
  const [isUpdateTripModalOpen, setIsTripUpdateTripModalOpen] = useState(false)

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true);
  }
  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false);
  }
  function closeGuestsManagerModal() {
    setIsGuestsManagerModalOpen(false);
    window.document.location.reload();
  }
  function openGuestsManagerModal() {
    setIsGuestsManagerModalOpen(true);
  }
  function closeAddImportantLinkModal() {
    setIsImportantLinkModalOpen(false);
  }
  function openAddImportantLinkModal() {
    setIsImportantLinkModalOpen(true);
  }

  function closeUpdateTripModal() {
    setIsTripUpdateTripModalOpen(false);
  }
  function openUpdateTripModal() {
    setIsTripUpdateTripModalOpen(true);
  }
  return (
    <div className="max-w-6xl px-4 py-10 mx-auto flex flex-col gap-8">
      <DestinationAndDateHeader openUpdateTripModal={openUpdateTripModal}/>
      <main className="flex gap-16 px-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Atividades</h2>
            <button
              onClick={openCreateActivityModal}
              className="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400"
            >
              <Plus className="size-5" />
              Cadastrar atividade
            </button>
          </div>
          <Activities />
        </div>

        <div className="w-80 space-y-6">
          <ImportantLinks
            openAddImportantLinkModal={openAddImportantLinkModal}
          />
          <div className="w-full h-px bg-zinc-800" />
          <div></div>
          <Guests openGuestsManagerModal={openGuestsManagerModal} />
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal
          closeCreateActivityModal={closeCreateActivityModal}
        />
      )}

      {isAddImportantLinkModalOpen && (
        <AddImportantLinksModal
          closeAddImportantLinkModal={closeAddImportantLinkModal}
        />
      )}

      {isGuestsManagerModalOpen && (
        <GuestsManagerModal closeGuestsManagerModal={closeGuestsManagerModal} />
      )}

      {isUpdateTripModalOpen && (
        <UpdateTripModal  closeUpdateTripModal={closeUpdateTripModal}/>
      )}
    </div>
  );
}
