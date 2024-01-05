import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { EntityType } from '../../../models/enums/EntityType';
import { VideoPlayer } from '../components/VideoPlayer';
import { Playlist } from '../components/Playlist';
import { ROUTES } from '../Routes';
import { AppService } from '../services/AppService';
import { sortBy } from 'lodash';

export const VideoPage = () => {
    const { id } = useParams();
    const [selectedVideo, setSelectedVideo] = useState<EntityModel | null>(null);
    const [videoList, setVideoList] = useState<EntityModel[]>([]);
    const [playlist, setPlaylist] = useState(false);
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
            if (selectedVideo?.progress !== undefined && selectedVideo.progress <= progress) {
                AppService.updateProgress(selectedVideo.id, progress);
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
            }
        }
    };

    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        if (id) {
            AppService.getEntitySiblings(id).then((result: EntityModel[]) => {
                const tempList = result.filter((each) => each.type === EntityType.Video)
                setVideoList(sortBy(tempList, ['name']));
            });
        }
    }, [id]);

    useEffect(() => {
        const video = videoList.find((each) => each.id === Number(id)) || null;
        setSelectedVideo(video);
    }, [videoList]);

    return (
        <div className="d-flex">
            <VideoPlayer
                videoSrc={selectedVideo}
                playlist={playlist}
                playNext={playNext}
                setPlaylist={setPlaylist}
                updateProgress={updateVideoProgress}
                goBack={goBack}
            />
            {playlist && <Playlist videoList={videoList} activeVideo={selectedVideo} play={play} />}
        </div>
    );
};
