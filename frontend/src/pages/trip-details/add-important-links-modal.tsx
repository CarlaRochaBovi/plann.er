import { Link2, Tag, X } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

interface AddImportantLinksModalProps {
  closeAddImportantLinkModal: () => void;
}

export function AddImportantLinksModal({
  closeAddImportantLinkModal,
}:AddImportantLinksModalProps) {

  const { tripId } = useParams();

  async function addNewLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const title = data.get("title")?.toString();
    const url = data.get("url")?.toString();

    if (!title || !url) return alert("Por favor preencha todas as informações!");

    try {
      new URL(url);
    } catch (_) {
      return alert("Por favor, insira uma URL válida.")
    }

    await api.post(`/trips/${tripId}/links`, {
      title, url
    });

    window.document.location.reload()
  }
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-lg font-semibold">Confirmar criação do link</h2>
          <button>
            <X
              className="size-5 text-zinc-400"
              onClick={closeAddImportantLinkModal}
            />
          </button>
        </div>
        <form
          onSubmit={addNewLink}
          className="space-y-3"
        >
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <input
              name="title"
              placeholder="Nome do link"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              required
            />
          </div>

          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Link2 className="text-zinc-400 size-5" />
            <input
              name="url"
              placeholder="Link"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              required
            />
          </div>

          <Button
            size="full"
            variant="primary"
            type="submit"
          >
            Salvar link
          </Button>
        </form>
      </div>
    </div>
  );
}
