import { api } from "@/services/api";
import { convertDurationToTimeString } from "@/utils/convertDurationToTimeString";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import styles from "./episode.module.scss";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useContext } from "react";
import { usePlayer } from "@/contexts/PlayerContext";

type Episode = {
  episode: {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    description: string;
    url: string;
  };
};

export default function Episode({ episode }: Episode) {
  const {play} = usePlayer();
  const router = useRouter();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <button type="button">
          <Link href="/">
            <img src="/arrow-left.svg" alt="Voltar" />
          </Link>
        </button>

        <Image
          width={600}
          height={200}
          alt="thumbnail"
          src={episode.thumbnail}
          className={styles.thumbnailImage}
          objectFit="cover"
        />

        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as { slug: string };

  const { data } = await api.get(`/episodes/${slug}`, {});

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
