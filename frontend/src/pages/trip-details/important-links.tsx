import { Link2, Link2Off, Plus } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";

interface ImportantLink {
  id: string;
  title: string;
  url: string;
}

interface ImportantLinksProps {
  openAddImportantLinkModal: () => void;
}

export function ImportantLinks({
  openAddImportantLinkModal,
}: ImportantLinksProps) {
  const { tripId } = useParams();
  const [importantLinks, setImportantLinks] = useState<ImportantLink[]>([]);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);

  const fetchLinks = () => {
    api
      .get(`/trips/${tripId}/links`)
      .then((response) => setImportantLinks(response.data.links))
      .catch((error) => console.error("Error fetching links:", error));
  };

  useEffect(() => {
    fetchLinks();
  }, [tripId]);

  const deleteLink = (id: string) => {
    api
      .delete(`/trips/${tripId}/links/${id}`)
      .then(() => {
        setImportantLinks((prevLinks) =>
          prevLinks.filter((link) => link.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting link:", error);
        alert("Erro ao deletar link.");
      });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>

      <div className="space-y-5">
        {importantLinks.map((importantLink) => (
          <div
            key={importantLink.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <span className="block font-medium truncate text-zinc-100">
                {importantLink.title}
              </span>
              <a
                href={importantLink.url}
                className="block text-sm text-zinc-400 truncate hover:text-zinc-200"
              >
                {importantLink.url}
              </a>
            </div>

            <button
              onClick={() => deleteLink(importantLink.id)}
              onMouseEnter={() => setHoveredLinkId(importantLink.id)}
              onMouseLeave={() => setHoveredLinkId(null)}
              className="bg-transparent"
            >
              {hoveredLinkId === importantLink.id ? (
                <Link2Off className="text-zinc-400 size-5 shrink-0 hover:text-zinc-200" />
              ) : (
                <Link2 className="text-zinc-400 size-5 shrink-0 hover:text-zinc-200" />
              )}
            </button>
          </div>
        ))}
      </div>

      <Button
        onClick={openAddImportantLinkModal}
        variant="secondary"
        size="full"
      >
        Cadastrar novo link
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
