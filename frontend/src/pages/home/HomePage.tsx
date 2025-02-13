import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import GridSection from "./components/GridSection";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
  const {
    isLoading,
    featuredSongs,
    madeOfYouSongs,
    trendingSongs,
    fetchFeaturedSongs,
    fetchMadeOfYouSongs,
    fetchTrendingSongs,
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeOfYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeOfYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (
      madeOfYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeOfYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, featuredSongs, madeOfYouSongs, trendingSongs]);

  return (
    <main className="rounded-sm overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl md:text-3xl mb-4 font-bold">
            Good Afternoon
          </h1>
          <FeaturedSection />
          <div className="space-y-8">
            <GridSection
              title="Made For You"
              songs={madeOfYouSongs}
              isLoading={isLoading}
            />
            <GridSection
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
