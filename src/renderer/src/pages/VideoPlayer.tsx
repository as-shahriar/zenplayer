import { useParams } from 'react-router-dom';
import { ApiKey } from '../../../constants/appConstants';
import { useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { EntityType } from '../../../models/EntityType';
import { Video } from '../components/Video';
import { Playlist } from '../components/Playlist';

export const VideoPlayer = () => {
    const { id } = useParams();
    const [videoSrc, setVideoSrc] = useState('');
    const [videoList, setVideoList] = useState<EntityModel[]>([]);
    const [playlist, setPlaylist] = useState(false);

    useEffect(() => {
        if (id) {
            window[ApiKey].getEntityAndSibling(id).then((result: EntityModel[]) => {
                setVideoList(result.filter((each) => each.type === EntityType.Video));
            });
        }
    }, [id]);

    useEffect(() => {
        setVideoSrc(videoList.find((each) => each.id === Number(id))?.path || '');
    }, [videoList]);

    return (
        <div className="d-flex">
            <button
                className="btn btn-primary position-absolute top-1 z-3"
                onClick={() => setPlaylist((e) => !e)}
            >
                Playlist
            </button>
            <Video videoSrc={videoSrc} playlist={playlist} />
            {playlist && <Playlist videoList={videoList} />}
        </div>
    );
};
