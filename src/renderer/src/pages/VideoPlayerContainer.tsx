import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { ApiKey } from '../../../constants/appConstants';
import { useEffect, useRef, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { EntityType } from '../../../models/EntityType';
import { VideoPlayer } from '../components/VideoPlayer';
import { Playlist } from '../components/Playlist';
import { ROUTES } from '../Routes';

export const VideoPlayerContainer = () => {
    const { id } = useParams();
    const [selectedVideo, setSelectedVideo] = useState<EntityModel | null>(null);
    const [videoList, setVideoList] = useState<EntityModel[]>([]);
    const [playlist, setPlaylist] = useState(false);
    const uploadProgress = useRef(0);
    const navigate = useNavigate();

    const playNext = () => {
        const currentIndex = videoList.findIndex((each) => each.id === selectedVideo?.id);
        if (currentIndex < videoList.length - 1 && currentIndex !== -1) {
            play(videoList[currentIndex + 1].id);
        }
    };

    const play = (id: number) => {
        navigate(generatePath(ROUTES.VIDEO, { id }), { replace: true });
    };

    const updateVideoProgress = (total: number, current: number) => {
        if (!isNaN(current) && !isNaN(total) && total !== 0) {
            const progress = (current / total) * 100;
            uploadProgress.current += 1;
            if (
                selectedVideo?.progress !== undefined &&
                selectedVideo.progress <= progress &&
                (uploadProgress.current > 30 || progress === 100)
            ) {
                window[ApiKey].updateProgress(selectedVideo.id, progress);
                setVideoList((prev) => {
                    return prev.map((each) => {
                        if (each.id === selectedVideo.id) {
                            return {
                                ...each,
                                progress
                            };
                        }
                        return each;
                    });
                });
                uploadProgress.current = 0;
            }
        }
    };

    useEffect(() => {
        if (id) {
            window[ApiKey].getEntityAndSibling(id).then((result: EntityModel[]) => {
                setVideoList(result.filter((each) => each.type === EntityType.Video));
            });
        }
    }, [id]);

    useEffect(() => {
        const video = videoList.find((each) => each.id === Number(id)) || null;
        setSelectedVideo(video);
    }, [videoList]);

    useEffect(() => {
        uploadProgress.current = 0;
    }, [selectedVideo]);

    return (
        <div className="d-flex">
            <VideoPlayer
                videoSrc={selectedVideo}
                playlist={playlist}
                playNext={playNext}
                setPlaylist={setPlaylist}
                updateProgress={updateVideoProgress}
            />
            {playlist && <Playlist videoList={videoList} activeVideo={selectedVideo} play={play} />}
        </div>
    );
};
