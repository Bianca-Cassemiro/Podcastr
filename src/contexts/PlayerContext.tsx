import { ReactNode, createContext, useCallback, useContext, useState } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean,
  isShuffling: boolean,
  hasNext: boolean,
  hasPrevious: boolean,
  toggleLoop: () => void,
  togglePlay: () => void;
  toggleShuffle: () => void;
  playList: (list: Episode[], index: number) => void;
  play: (episode: Episode) => void;
  playNext:() => void;
  playPrevious: () => void;
  setPlayingState: (state: boolean) => void;
  clearPlayerState: () => void;
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
  };

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setEpisodeIndex(index);
    setIsPlaying(true);
  }

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setEpisodeIndex(0);
  }
  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling ||(currentEpisodeIndex + 1) < episodeList.length;

  function playNext() {

    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        hasNext,
        hasPrevious,
        isPlaying,
        isLooping,
        isShuffling,
        playList,
        play,
        playNext,
        playPrevious,
        toggleLoop,
        togglePlay,
        toggleShuffle,
        setPlayingState,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}


export const usePlayer = () => {
  return useContext(PlayerContext);
}