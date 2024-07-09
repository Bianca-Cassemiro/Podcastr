import { useContext, useRef, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { PlayerContext } from "@/contexts/PlayerContext";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { convertDurationToTimeString } from "@/utils/convertDurationToTimeString";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    playNext,
    playPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    clearPlayerState,
    hasNext,
    hasPrevious,
  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

  const handleStyle = { backgroundColor: "#04d361" };
  const railStyle = { borderColor: "#9f75ff" };

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);


  function setupProgressLinear(){
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      
      audioRef.current?.addEventListener('timeupdate', event =>{
        if (audioRef.current) {
          setProgress(Math.floor(audioRef.current.currentTime));
        }
      })
    }
  }

  function handleSeek(amount: number){
    if (audioRef.current) {
      audioRef.current.currentTime = amount;
    }
    setProgress(amount);
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext()
    } else{
      clearPlayerState()
    }
  }
  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={290}
            height={250}
            src={episode.thumbnail}
            alt="thumbnail"
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider 
              max={episode.duration}
              onChange={handleSeek}
              onEnded={handleEpisodeEnded}
              styles={{ track: handleStyle, rail: railStyle }} 
              value={progress}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressLinear}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" 
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle} 
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Pause" />
            )}
          </button>

          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Embaralhar" />
          </button>

          <button type="button" 
            disabled={!episode} 
            onClick={toggleLoop} 
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
