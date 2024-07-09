import { api } from "@/services/api";
import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import Head from "next/head";
import { ptBR } from "date-fns/locale";
import { convertDurationToTimeString } from "@/utils/convertDurationToTimeString";
import styles from "./home.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { PlayerContext } from "@/contexts/PlayerContext";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
  published_at: string;
};

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (

    <div className={styles.homepage}>
    <Head>
    <title>Home | Podcastr</title>
    </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos </h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  src={episode.thumbnail}
                  alt={episode.title}
                  width={900}
                  height={400}
                  objectFit="cover"
                  
                />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <div>{episode.title}</div>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <div>
        <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => (
                <tr key={episode.id}>
                  <td>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <div>{episode.title}</div>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode: any) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
