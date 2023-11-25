import { useParams } from 'react-router-dom';
import { ApiKey } from '../../../constants/appConstants';
import { useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { EntityType } from '../../../models/EntityType';
import { VideoPlayer } from '../components/VideoPlayer';
import { Playlist } from '../components/Playlist';

export const VideoPlayerContainer = () => {
    const { id } = useParams();
    const [videoSrc, setVideoSrc] = useState<EntityModel | null>(null);
    const [videoList, setVideoList] = useState<EntityModel[]>([]);
    const [playlist, setPlaylist] = useState(false);

    const playNext = () => {
        const currentIndex = videoList.findIndex((each) => each.id === videoSrc?.id);
        if (currentIndex < videoList.length - 1 && currentIndex !== -1) {
            setVideoSrc(videoList[currentIndex + 1]);
        }
    };

    const play = (id: number) => {
        const video = videoList.find((each) => each.id === Number(id)) || null;
        setVideoSrc(video);
    };

    useEffect(() => {
        if (id) {
            window[ApiKey].getEntityAndSibling(id).then((result: EntityModel[]) => {
                setVideoList(result.filter((each) => each.type === EntityType.Video));
            });
        }
    }, [id]);

    useEffect(() => {
        play(Number(id));
    }, [videoList]);

    return (
        <div className="d-flex">
            <VideoPlayer
                videoSrc={videoSrc}
                playlist={playlist}
                playNext={playNext}
                setPlaylist={setPlaylist}
            />
            {playlist && <Playlist videoList={videoList} activeVideo={videoSrc} play={play} />}
        </div>
    );
};
