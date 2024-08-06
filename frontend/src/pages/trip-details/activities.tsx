import { CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";

interface Activity {
  date: string;
  activities: {
    id: string;
    title: string;
    occurs_at: string;
  }[];
}

export function Activities() {
  const { tripId } = useParams();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  useEffect(() => {
    api
      .get(`trips/${tripId}/activities`)
      .then((response) => setActivities(response.data.activities));
    checkIfActivityIsDone()
  }, [tripId]);

  useEffect(() => {
    checkIfActivityIsDone();
  }, [activities]);

  function checkIfActivityIsDone() {
    const completed: string[] = [];

    activities.forEach(category => {
      category.activities.forEach(activity => {
        if(dayjs(new Date()).isAfter(activity.occurs_at)) {
          completed.push(activity.id);
        }
      });
    });

    setCompletedActivities(completed);
  }

  function capitalizeFirstLetter(word: string | null | undefined): string | null | undefined {
    if (!word) return word; // Verifica se a palavra é vazia, nula ou indefinida
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <div className="space-y-8">
      {activities.map((category) => {
        return (
          <div
            key={category.date}
            className="space-y-2.5"
          >
            <div className="flex gap-2 items-baseline">
              <span className="text-xl text-zinc-300 font-semibold">
                Dia {format(category.date, "d")}
              </span>
              <span className="text-xs text-zinc-500">
                {capitalizeFirstLetter(format(category.date, "EEEE", { locale: ptBR }))}
              </span>
            </div>

            {category.activities.length > 0 ? (
              <div className="space-y-2.5">
                 {category.activities.map((activity) => {
                const isCompleted = completedActivities.includes(activity.id);
                return (
                  <div key={activity.id}>
                    <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                      <CircleCheck className={`size-5 ${isCompleted ? 'text-lime-300' : 'text-zinc-400'}`} />
                      <span className="text-zinc-100">{activity.title}</span>
                      <span className="text-zinc-100 text-sm ml-auto">
                        {format(activity.occurs_at, 'HH:mm')}h
                      </span>
                    </div>
                  </div>
                );
              })}

              </div>
            ) : (
              <p className="text-zinc-500 text-sm">
                Nenhuma atividade cadastrada nessa data.
              </p>
            )}
          </div>
        );
      })}

    </div>
  );
}
